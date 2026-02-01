/**
 * Inquiry Controller
 * จัดการการติดต่อสอบถามจากผู้ประเมิน
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * สร้างติดต่อสอบถามใหม่
 * POST /api/inquiry/create
 * @param {string} name - ชื่อ - นามสกุล
 * @param {string} email - อีเมล
 * @param {string} phone - เบอร์โทรศัพท์
 * @param {string} message - ข้อความ
 */
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุข้อมูลที่จำเป็นทั้งหมด",
      });
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบอีเมลไม่ถูกต้อง",
      });
    }

    // ตรวจสอบรูปแบบเบอร์โทรศัพท์
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง",
      });
    }

    // บันทึกติดต่อสอบถามลงฐานข้อมูล
    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
        status: "UNREAD",
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
 * @param {string} status - (optional) กรองตามสถานะ: UNREAD, READ, RESOLVED
 * @param {number} page - (optional) หน้า (default: 1)
 * @param {number} limit - (optional) จำนวนรายการต่อหน้า (default: 10)
 */
const getInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // สร้างเงื่อนไข filter
    const where = {};
    if (status) {
      where.status = status;
    }

    // คำนวณ offset
    const offset = (page - 1) * limit;

    // ดึงข้อมูลติดต่อสอบถาม
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
        totalPages: Math.ceil(total / limit),
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

    // อัปเดตสถานะเป็นอ่านแล้ว
    if (inquiry.status === "UNREAD") {
      await prisma.inquiry.update({
        where: { id: parseInt(id) },
        data: {
          status: "READ",
          readAt: new Date(),
        },
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
 * ตอบกลับติดต่อสอบถาม
 * PATCH /api/inquiry/:id/reply
 * @param {string} reply - ข้อความตอบกลับ
 * @param {string} status - (optional) สถานะใหม่: READ, RESOLVED
 */
const replyInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status = "RESOLVED" } = req.body;

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุข้อความตอบกลับ",
      });
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบติดต่อสอบถามที่ขอ",
      });
    }

    // อัปเดตการตอบกลับ
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: {
        reply: reply.trim(),
        status,
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "ส่งการตอบกลับเรียบร้อยแล้ว",
      data: updatedInquiry,
    });
  } catch (error) {
    console.error("Error replying to inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตอบกลับ",
      error: error.message,
    });
  }
};

/**
 * อัปเดตสถานะติดต่อสอบถาม
 * PATCH /api/inquiry/:id/status
 * @param {string} status - สถานะใหม่: UNREAD, READ, RESOLVED
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["UNREAD", "READ", "RESOLVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "สถานะไม่ถูกต้อง",
      });
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบติดต่อสอบถามที่ขอ",
      });
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data: {
        status,
        readAt: status !== "UNREAD" ? new Date() : inquiry.readAt,
      },
    });

    return res.status(200).json({
      success: true,
      message: "อัปเดตสถานะเรียบร้อยแล้ว",
      data: updatedInquiry,
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
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

/**
 * สถิติติดต่อสอบถาม
 * GET /api/inquiry/stats/summary
 */
const getInquiryStats = async (req, res) => {
  try {
    const [unreadCount, readCount, resolvedCount, total] = await Promise.all([
      prisma.inquiry.count({ where: { status: "UNREAD" } }),
      prisma.inquiry.count({ where: { status: "READ" } }),
      prisma.inquiry.count({ where: { status: "RESOLVED" } }),
      prisma.inquiry.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        unread: unreadCount,
        read: readCount,
        resolved: resolvedCount,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching inquiry stats:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงสถิติ",
      error: error.message,
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  replyInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats,
};
