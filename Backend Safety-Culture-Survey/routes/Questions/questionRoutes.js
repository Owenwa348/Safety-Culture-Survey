// routes/Questions/questionRoutes.js
const express = require('express')
const router = express.Router()
const {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  moveQuestion
} = require('../../controllers/Questions/questionController')

router.get('/', getQuestions)
router.post('/', addQuestion)
router.put('/:id', updateQuestion)
router.delete('/:id', deleteQuestion)
router.put('/:id/move', moveQuestion)

module.exports = router
