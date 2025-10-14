// routes/Department/departmentRoutes.js
const express = require('express')
const router = express.Router()
const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../../controllers/Department/departmentController')

router.get('/', getDepartments)
router.post('/', addDepartment)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

module.exports = router
