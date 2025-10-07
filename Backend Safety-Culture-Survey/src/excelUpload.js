// src/excelUpload.js
import express from 'express';
import multer from 'multer';
import ExcelJS from 'exceljs';
import prisma from './prisma.js';

const router = express.Router();
const upload = multer(); // เก็บไฟล์ใน memory

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์ Excel' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0]; // อ่าน sheet แรก
    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // ข้าม header
      const email = row.getCell(1).value?.toString().trim();
      const company = row.getCell(2).value?.toString().trim();

      if (email && company) {
        rows.push({ email_user: email, company_user: company });
      }
    });

    // insert เข้าฐานข้อมูล
    for (const row of rows) {
      await prisma.user_excel.upsert({
        where: { email_user: row.email_user },
        update: { company_user: row.company_user },
        create: row,
      });
    }

    res.json({ message: 'อัปโหลดไฟล์สำเร็จ และบันทึกข้อมูลลงฐานข้อมูลแล้ว' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
});

export default router;
