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
  replyInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats,
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
 * Query: { status, page, limit }
 */
router.get("/list", getInquiries);

/**
 * GET /api/inquiry/stats/summary
 * ดึงสถิติติดต่อสอบถาม
 */
router.get("/stats/summary", getInquiryStats);

/**
 * GET /api/inquiry/:id
 * ดึงรายละเอียดติดต่อสอบถาม
 */
router.get("/:id", getInquiryById);

/**
 * PATCH /api/inquiry/:id/reply
 * ตอบกลับติดต่อสอบถาม
 * Body: { reply, status }
 */
router.patch("/:id/reply", replyInquiry);

/**
 * PATCH /api/inquiry/:id/status
 * อัปเดตสถานะติดต่อสอบถาม
 * Body: { status }
 */
router.patch("/:id/status", updateInquiryStatus);

/**
 * DELETE /api/inquiry/:id
 * ลบติดต่อสอบถาม
 */
router.delete("/:id", deleteInquiry);

module.exports = router;
