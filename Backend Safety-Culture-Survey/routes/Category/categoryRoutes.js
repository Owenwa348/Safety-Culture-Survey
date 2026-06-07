// routes/Category/categoryRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  reorderCategory   // ✅ เพิ่ม
} = require('../../controllers/Category/categoryController')

router.get('/',              authMiddleware, getCategories)
router.post('/',             authMiddleware, addCategory)
router.put('/:id/reorder',  authMiddleware, reorderCategory)  // ✅ เพิ่ม (ต้องอยู่ก่อน /:id)
router.put('/:id',          authMiddleware, updateCategory)
router.delete('/:id',       authMiddleware, deleteCategory)

module.exports = router