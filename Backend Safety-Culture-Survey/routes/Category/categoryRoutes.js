// routes/Category/categoryRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = require('../../controllers/Category/categoryController')

router.get('/',       authMiddleware, getCategories)
router.post('/',      authMiddleware, addCategory)
router.put('/:id',    authMiddleware, updateCategory)
router.delete('/:id', authMiddleware, deleteCategory)

module.exports = router