// routes/Position/positionRoutes.js
const express = require('express')
const router = express.Router()
const {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} = require('../../controllers/Position/positionController')

router.get('/', getPositions)
router.post('/', addPosition)
router.put('/:id', updatePosition)
router.delete('/:id', deletePosition)

module.exports = router
