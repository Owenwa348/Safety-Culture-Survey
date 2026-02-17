/**
 * Inquiry Routes
 * เส้นทาง API สำหรับจัดการติดต่อสอบถาม
 */

const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  deleteInquiry,
} = require("../../controllers/Inquiry/inquiryController");

/**
 * Public Routes (เปิดให้ใช้งานสำหรับผู้ประเมิน)
 */

/**
 * POST /api/inquiry/create
 * ส่งติดต่อสอบถาม
 * Body: { name, email, phone, message }
 */
router.post("/create", createInquiry);

/**
 * SuperAdmin Routes (ต้องยืนยันตัวตน)
 */

/**
 * GET /api/inquiry/list
 * ดึงรายการติดต่อสอบถาม
 * Query: { page, limit, year, month, company }
 */
router.get("/list", getInquiries);

/**
 * GET /api/inquiry/:id
 * ดึงรายละเอียดติดต่อสอบถาม
 */
router.get("/:id", getInquiryById);

/**
 * DELETE /api/inquiry/:id
 * ลบติดต่อสอบถาม
 */
router.delete("/:id", deleteInquiry);

module.exports = router;
