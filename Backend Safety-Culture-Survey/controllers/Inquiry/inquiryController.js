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
 * @param {string} year - (optional) กรองตามปี (format: YYYY)
 * @param {string} month - (optional) กรองตามเดือน (format: M or MM)
 * @param {string} company - (optional) กรองตามบริษัท
 * @param {number} page - (optional) หน้า (default: 1)
 * @param {number} limit - (optional) จำนวนรายการต่อหน้า (default: 10)
 */
const getInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, year: yearParam, month: monthParam, company } = req.query;

    // สร้างเงื่อนไข filter
    const where = {};

    if (yearParam) {
      const year = parseInt(yearParam);
      if (monthParam) {
        // Filter by year and month
        const month = parseInt(monthParam);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        where.createdAt = {
          gte: startDate,
          lt: endDate,
        };
      } else {
        // Filter by year only
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);
        where.createdAt = {
          gte: startDate,
          lt: endDate,
        };
      }
    }

    if (company) {
      const usersInCompany = await prisma.user.findMany({
        where: { company_user: company },
        select: { email_user: true }
      });
      const emails = usersInCompany.map(u => u.email_user);
      
      if (emails.length > 0) {
        where.email = {
          in: emails
        };
      } else {
        // If no users found for the company, return no inquiries
        return res.status(200).json({
          success: true,
          data: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            totalPages: 0,
          },
        });
      }
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
