// routes/Position/positionRoutes.js
const express = require('express')
const router  = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getPositionsPublic,
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} = require('../../controllers/Position/positionController')

// ✅ Public — ใช้ใน Registration page (ไม่ต้อง token)
//    ต้องประกาศก่อน authMiddleware routes เพราะ Express จับ pattern จากบนลงล่าง
router.get('/public', getPositionsPublic)

// 🔒 Protected routes — ต้อง token
router.get('/',       authMiddleware, getPositions)
router.post('/',      authMiddleware, addPosition)
router.put('/:id',    authMiddleware, updatePosition)
router.delete('/:id', authMiddleware, deletePosition)

module.exports = router