// routes/Workgroup/workGroupRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getWorkGroupsPublic,
  getWorkGroups,
  addWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
} = require('../../controllers/Workgroup/workGroupController')

// ✅ Public — ใช้ใน Registration page (ไม่ต้อง token)
router.get('/public', getWorkGroupsPublic)

// 🔒 Protected — ต้อง token
router.get('/', authMiddleware, getWorkGroups)
router.post('/', authMiddleware, addWorkGroup)
router.put('/:id', authMiddleware, updateWorkGroup)
router.delete('/:id', authMiddleware, deleteWorkGroup)

module.exports = router