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

    // อ่าน header เพื่อตรวจสอบคอลัมน์
    const headerRow = worksheet.getRow(1);
    const headers = [];
    headerRow.eachCell((cell) => {
      headers.push(cell.value?.toString().trim().toLowerCase() || '');
    });

    const hasEmail = headers.some(h => h.includes('email') || h === 'อีเมล' || h === 'email_user');
    const hasCompany = headers.some(h => h.includes('company') || h === 'บริษัท' || h === 'company_user');
    const hasDepartment = headers.some(h => h.includes('department') || h === 'ส่วนงาน' || h === 'department_user');

    if (!hasEmail || !hasCompany) {
      return res.status(400).json({ 
        message: 'รูปแบบไฟล์ไม่ถูกต้อง: ต้องมีคอลัมน์ Email และ Company',
        details: `ตรวจพบคอลัมน์: ${headers.join(', ')}`
      });
    }

    const rows = [];
    let invalidRows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const email = row.getCell(1).value?.toString().trim();
      const company = row.getCell(2).value?.toString().trim();
      const department = row.getCell(3)?.value?.toString().trim() || null; // ✅ อ่านส่วนงาน

      if (!email || !company) {
        invalidRows.push(rowNumber);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        invalidRows.push(rowNumber);
        return;
      }

      rows.push({ 
        email_user: email, 
        company_user: company,
        department_user: department
      });
    });

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

    const existing = await prisma.user_excel.findMany({
      where: {
        email_user: { in: rows.map(r => r.email_user) }
      },
      select: { email_user: true, company_user: true, department_user: true }
    });

    const existingMap = new Map(existing.map(e => [e.email_user, { company_user: e.company_user, department_user: e.department_user }]));

    const allExist = rows.every(r => existingMap.has(r.email_user));
    const noChanges = rows.every(r => {
      const ex = existingMap.get(r.email_user);
      return ex && ex.company_user === r.company_user && ex.department_user === r.department_user;
    });

    if (allExist && noChanges) {
      return res.status(409).json({ 
        message: 'มีข้อมูลในฐานข้อมูลแล้ว',
        details: { total: rows.length, existing: rows.length }
      });
    }

    for (const row of rows) {
      try {
        const result = await prisma.user_excel.upsert({
          where: { email_user: row.email_user },
          update: { company_user: row.company_user, department_user: row.department_user },
          create: row,
        });

        const existed = existingMap.has(row.email_user);
        const updated = existed && (
          existingMap.get(row.email_user).company_user !== row.company_user ||
          existingMap.get(row.email_user).department_user !== row.department_user
        );

        if (!existed) insertedCount++;
        else if (updated) updatedCount++;
      } catch (err) {
        console.error(`Error saving ${row.email_user}:`, err);
      }
    }

    let message = '';
    if (insertedCount > 0) message += `เพิ่มข้อมูลใหม่ ${insertedCount} รายการ`;
    if (updatedCount > 0) message += (message ? ', ' : '') + `อัปเดต ${updatedCount} รายการ`;

    res.json({
      message: message || 'ดำเนินการเสร็จสิ้น',
      details: { total: rows.length, inserted: insertedCount, updated: updatedCount }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์', error: error.message });
  }
});

module.exports = router;
