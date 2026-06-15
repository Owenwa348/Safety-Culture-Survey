// routes/Experience/experienceRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getExperiences,
  getExperiencesPublic,
  addExperience,
  updateExperience,
  deleteExperience,
} = require('../../controllers/Experience/experienceController')

// ✅ Public route — ใช้ใน Registration page (ไม่ต้อง token)
router.get('/public', getExperiencesPublic)

// 🔒 Protected routes — ต้อง token
router.get('/', authMiddleware, getExperiences)
router.post('/', authMiddleware, addExperience)
router.put('/:id', authMiddleware, updateExperience)
router.delete('/:id', authMiddleware, deleteExperience)

module.exports = router