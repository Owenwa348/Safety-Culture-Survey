// routes/Analytics/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAggregatedSurveyData,
  getDemographicAnalysis,
  getTrendAnalysis
} = require('../../controllers/Analytics/analyticsController');

// Get aggregated data for graphs
router.get('/aggregated', getAggregatedSurveyData);

// Get demographic analysis
router.get('/demographics', getDemographicAnalysis);

// Get trend analysis
router.get('/trends', getTrendAnalysis);

module.exports = router;