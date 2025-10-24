// routes/assessmentRoutes.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * GET /api/assessment/questions
 * ดึงข้อมูลทุกหมวดหมู่พร้อมคำถามและตัวเลือก (ระดับคะแนน)
 */
router.get("/questions", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        questions: {
          include: {
            options: true, // ดึงระดับตัวเลือก (level descriptions)
          },
          orderBy: { order: "asc" }, // เรียงลำดับคำถามในหมวดหมู่
        },
      },
      orderBy: { id: "asc" }, // เรียงหมวดหมู่ตามลำดับ
    });

    // ปรับข้อมูลให้อยู่ในรูปที่ frontend ใช้งานง่าย
    const formatted = categories.flatMap((cat) =>
      cat.questions.map((q) => ({
        id: q.id,
        category: cat.name,
        th: q.text, // สมมติว่าข้อคำถามเก็บในฟิลด์ text
        levels: q.options.map((opt) => ({
          th: opt.text, // คำอธิบายระดับคะแนน
        })),
      }))
    );

    res.json(formatted);
  } catch (error) {
    console.error("❌ Error fetching assessment questions:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error });
  }
});

module.exports = router;
