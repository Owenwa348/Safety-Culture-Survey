// routes/Analytics/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/authMiddleware');
const { 
  getAggregatedSurveyData,
  getDemographicAnalysis,
  getTrendAnalysis,
  getUserCompletionStatus,
  getSurveyDataForChart,
  getCompanies,
  getStackedChartData,
  getAssessmentYears,
  getQuestionResultsData,
  getWorkGroupRawData,
  getWorkGroupEvaluationData,
  getEvaluationData,
  getRawAnswers,
  getOpinionsData,
  getQuestionsWithCategory, // ✅ import ใหม่
} = require('../../controllers/Analytics/analyticsController');

// ✅ ใช้ authMiddleware กับทุก route
router.use(authMiddleware);

router.get('/aggregated', getAggregatedSurveyData);
router.get('/demographics', getDemographicAnalysis);
router.get('/trends', getTrendAnalysis);
router.get('/completion-status', getUserCompletionStatus);
router.get('/survey-data', getSurveyDataForChart);
router.get('/companies', getCompanies);
router.get('/stacked-chart-data', getStackedChartData);
router.get('/assessment-years', getAssessmentYears);
router.get('/question-results', getQuestionResultsData);
router.get('/workgroup-raw-data', getWorkGroupRawData);
router.get('/workgroup-evaluation', getWorkGroupEvaluationData);
router.get('/evaluation/current', getEvaluationData('current'));
router.get('/evaluation/future', getEvaluationData('future'));
router.get('/raw-answers', getRawAnswers);
router.get('/opinions', getOpinionsData);
router.get('/questions', getQuestionsWithCategory); // ✅ route ใหม่

module.exports = router;