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
  getAssessmentYears
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

module.exports = router;