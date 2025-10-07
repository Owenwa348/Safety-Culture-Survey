// routes/excelUploadRoutes.js
const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์ Excel' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    
    // ตรวจสอบ header
    const headerRow = worksheet.getRow(1);
    const headers = [];
    headerRow.eachCell((cell, colNumber) => {
      headers.push(cell.value?.toString().trim().toLowerCase() || '');
    });

    // ตรวจสอบว่ามีคอลัมน์ที่จำเป็นหรือไม่
    const hasEmail = headers.some(h => 
      h.includes('email') || h === 'อีเมล' || h === 'email_user'
    );
    const hasCompany = headers.some(h => 
      h.includes('company') || h === 'บริษัท' || h === 'company_user'
    );

    if (!hasEmail || !hasCompany) {
      return res.status(400).json({ 
        message: 'รูปแบบไฟล์ไม่ถูกต้อง: ต้องมีคอลัมน์ Email และ Company',
        details: `ตรวจพบคอลัมน์: ${headers.join(', ')}`
      });
    }

    const rows = [];
    let invalidRows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // ข้าม header
      
      const email = row.getCell(1).value?.toString().trim();
      const company = row.getCell(2).value?.toString().trim();

      // ตรวจสอบว่าข้อมูลครบถ้วน
      if (!email || !company) {
        invalidRows.push(rowNumber);
        return;
      }

      // ตรวจสอบรูปแบบ email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        invalidRows.push(rowNumber);
        return;
      }

      rows.push({ 
        email_user: email, 
        company_user: company 
      });
    });

    // ถ้าไม่มีข้อมูลที่ถูกต้อง
    if (rows.length === 0) {
      return res.status(400).json({ 
        message: 'ไม่พบข้อมูลที่ถูกต้องในไฟล์',
        invalidRows: invalidRows.length > 0 
          ? `แถวที่มีปัญหา: ${invalidRows.join(', ')}` 
          : 'ไฟล์ว่างเปล่าหรือไม่มีข้อมูล'
      });
    }

    let insertedCount = 0;
    let updatedCount = 0;

    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const existingEmails = await prisma.user_excel.findMany({
      where: {
        email_user: {
          in: rows.map(r => r.email_user)
        }
      },
      select: { email_user: true, company_user: true }
    });

    const existingEmailMap = new Map(
      existingEmails.map(e => [e.email_user, e.company_user])
    );

    // ถ้าข้อมูลซ้ำทั้งหมดและไม่มีการเปลี่ยนแปลง
    const allExist = rows.every(row => existingEmailMap.has(row.email_user));
    const noChanges = rows.every(row => 
      existingEmailMap.get(row.email_user) === row.company_user
    );

    if (allExist && noChanges) {
      return res.status(409).json({ 
        message: 'มีข้อมูลในฐานข้อมูลแล้ว',
        details: {
          total: rows.length,
          existing: rows.length
        }
      });
    }

    // บันทึกข้อมูล
    for (const row of rows) {
      try {
        const result = await prisma.user_excel.upsert({
          where: { email_user: row.email_user },
          update: { company_user: row.company_user },
          create: row,
        });

        // ตรวจสอบว่าเป็นการ insert หรือ update
        const wasExisting = existingEmailMap.has(row.email_user);
        const wasUpdated = wasExisting && 
          existingEmailMap.get(row.email_user) !== row.company_user;

        if (!wasExisting) {
          insertedCount++;
        } else if (wasUpdated) {
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${row.email_user}:`, error);
      }
    }

    // สร้างข้อความตอบกลับ
    let message = '';
    if (insertedCount > 0) {
      message += `เพิ่มข้อมูลใหม่ ${insertedCount} รายการ`;
    }
    if (updatedCount > 0) {
      message += (message ? ', ' : '') + `อัปเดต ${updatedCount} รายการ`;
    }

    res.json({ 
      message: message || 'ดำเนินการเสร็จสิ้น',
      details: {
        total: rows.length,
        inserted: insertedCount,
        updated: updatedCount
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์', 
      error: error.message 
    });
  }
});

module.exports = router;