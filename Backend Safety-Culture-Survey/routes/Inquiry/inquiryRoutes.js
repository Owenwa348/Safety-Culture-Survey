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

// POST /api/inquiry/create
router.post("/create", createInquiry);

// GET /api/inquiry/list
router.get("/list", getInquiries);

// GET /api/inquiry/:id
router.get("/:id", getInquiryById);

// DELETE /api/inquiry/:id
router.delete("/:id", deleteInquiry);

module.exports = router;