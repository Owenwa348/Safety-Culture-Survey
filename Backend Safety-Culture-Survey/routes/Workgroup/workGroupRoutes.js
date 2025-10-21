// routes/Workgroup/workGroupRoutes.js
const express = require('express')
const router = express.Router()
const {
  getWorkGroups,
  addWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
} = require('../../controllers/Workgroup/workGroupController')

router.get('/', getWorkGroups)
router.post('/', addWorkGroup)
router.put('/:id', updateWorkGroup)
router.delete('/:id', deleteWorkGroup)

module.exports = router
