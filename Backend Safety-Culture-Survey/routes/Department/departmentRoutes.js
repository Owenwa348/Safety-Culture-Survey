// routes/Department/departmentRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getDepartments,
  getDepartmentsPublic,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../../controllers/Department/departmentController')

// ✅ Public route — ใช้ใน Registration page (ไม่ต้อง token)
router.get('/public', getDepartmentsPublic)

// 🔒 Protected routes — ต้อง token
router.get('/', authMiddleware, getDepartments)
router.post('/', authMiddleware, addDepartment)
router.put('/:id', authMiddleware, updateDepartment)
router.delete('/:id', authMiddleware, deleteDepartment)

module.exports = router