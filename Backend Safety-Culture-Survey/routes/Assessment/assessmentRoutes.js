// routes/Assessment/assessmentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAssessmentData, 
  saveSurveyAnswer, 
  getUserSurveyAnswers, 
  getUserSurveyProgress 
} = require('../../controllers/Assessment/assessmentController');

router.get('/', getAssessmentData);
router.post('/answer', saveSurveyAnswer);
router.get('/answers/:userId', getUserSurveyAnswers);
router.get('/progress/:userId', getUserSurveyProgress);

module.exports = router;