const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    const users = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // ข้าม header
      users.push({
        email_user: row.getCell(1).value,
        company_user: row.getCell(2).value,
      });
    });

    for (const user of users) {
      await prisma.user_excel.create({ data: user });
    }

    res.json({ message: "Upload success", inserted: users.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
