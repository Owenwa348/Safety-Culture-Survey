/**
 * Inquiry Controller
 * จัดการการติดต่อสอบถามจากผู้ประเมิน
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * สร้างติดต่อสอบถามใหม่
 * POST /api/inquiry/create
 */
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุข้อมูลที่จำเป็นทั้งหมด",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบอีเมลไม่ถูกต้อง",
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง",
      });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "ส่งติดต่อสอบถามเรียบร้อยแล้ว ขอบคุณที่ติดต่อเรา!",
      data: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการส่งติดต่อสอบถาม",
      error: error.message,
    });
  }
};

/**
 * ดึงรายการติดต่อสอบถาม ใช้สำหรับ SuperAdmin
 * GET /api/inquiry/list
 * Query: { page, limit, year, month }
 * หมายเหตุ: ไม่มี filter บริษัท เพราะ inquiry ไม่ได้เก็บ company_id
 */
const getInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, year: yearParam, month: monthParam } = req.query;

    const where = {};

    if (yearParam) {
      const year = parseInt(yearParam);
      if (monthParam) {
        const month = parseInt(monthParam);
        where.createdAt = {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        };
      } else {
        where.createdAt = {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        };
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: parseInt(limit),
      }),
      prisma.inquiry.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลติดต่อสอบถาม",
      error: error.message,
    });
  }
};

/**
 * ดึงรายละเอียดติดต่อสอบถาม
 * GET /api/inquiry/:id
 */
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบติดต่อสอบถามที่ขอ",
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      error: error.message,
    });
  }
};

/**
 * ลบติดต่อสอบถาม
 * DELETE /api/inquiry/:id
 */
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบติดต่อสอบถามที่ขอ",
      });
    }

    await prisma.inquiry.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: "ลบติดต่อสอบถามเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบ",
      error: error.message,
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  deleteInquiry,
};