// routes/Department/departmentRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../../controllers/Department/departmentController')

router.get('/', authMiddleware, getDepartments)
router.post('/', authMiddleware, addDepartment)
router.put('/:id', authMiddleware, updateDepartment)
router.delete('/:id', authMiddleware, deleteDepartment)

module.exports = router