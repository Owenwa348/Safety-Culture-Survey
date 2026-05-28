// routes/Workgroup/workGroupRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getWorkGroups,
  addWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
} = require('../../controllers/Workgroup/workGroupController')

router.get('/', authMiddleware, getWorkGroups)
router.post('/', authMiddleware, addWorkGroup)
router.put('/:id', authMiddleware, updateWorkGroup)
router.delete('/:id', authMiddleware, deleteWorkGroup)

module.exports = router