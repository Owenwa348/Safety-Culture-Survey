// routes/Category/categoryRoutes.js
const express = require('express')
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = require('../../controllers/Category/categoryController')

const router = express.Router()

router.get('/', getCategories)
router.post('/', addCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
