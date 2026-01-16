// routes/Analytics/analyticsRoutes.js
const express = require('express');
const router = express.Router();
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
  getEvaluationData
} = require('../../controllers/Analytics/analyticsController');

// Get aggregated data for graphs
router.get('/aggregated', getAggregatedSurveyData);

// Get demographic analysis
router.get('/demographics', getDemographicAnalysis);

// Get trend analysis
router.get('/trends', getTrendAnalysis);

// Get user completion status
router.get('/completion-status', getUserCompletionStatus);

// Get survey data for horizontal bar chart (แยกตามคะแนน 1-5)
router.get('/survey-data', getSurveyDataForChart);

// Get list of companies
router.get('/companies', getCompanies);

// Get stacked chart data (ตามหมวดหมู่ทั้งหมด)
router.get('/stacked-chart-data', getStackedChartData);

// Get available assessment years
router.get('/assessment-years', getAssessmentYears);

// Get data formatted for the QuestionResults.vue component
router.get('/question-results', getQuestionResultsData);

// Get raw data for the WorkGroupEvaluationResults page
router.get('/workgroup-raw-data', getWorkGroupRawData);

// Get filtered data for the WorkGroupEvaluationResults page
router.get('/workgroup-evaluation', getWorkGroupEvaluationData);

// Get evaluation data for SalesBarChartDB
router.get('/evaluation/current', getEvaluationData('current'));
router.get('/evaluation/future', getEvaluationData('future'));


module.exports = router;