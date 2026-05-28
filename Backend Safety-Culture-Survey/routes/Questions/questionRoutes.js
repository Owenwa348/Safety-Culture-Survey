// routes/Questions/questionRoutes.js
const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../../middleware/authMiddleware')
const {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  moveQuestion
} = require('../../controllers/Questions/questionController')

router.get('/',        authMiddleware, getQuestions)
router.post('/',       authMiddleware, addQuestion)
router.put('/:id',     authMiddleware, updateQuestion)
router.delete('/:id',  authMiddleware, deleteQuestion)
router.put('/:id/move',authMiddleware, moveQuestion)

module.exports = router