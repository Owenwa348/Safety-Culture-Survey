// routes/Position/positionRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} = require('../../controllers/Position/positionController')

router.get('/', authMiddleware, getPositions)
router.post('/', authMiddleware, addPosition)
router.put('/:id', authMiddleware, updatePosition)
router.delete('/:id', authMiddleware, deletePosition)

module.exports = router