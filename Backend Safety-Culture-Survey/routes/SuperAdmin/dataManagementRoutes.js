// routes/SuperAdmin/dataManagementRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getDataStatistics,
  clearCompanySurveyData,
  archiveOldSurveyData
} = require('../../controllers/SuperAdmin/dataManagementController');

// Get data statistics
router.get('/statistics', getDataStatistics);

// Clear company survey data
router.post('/clear-company-data', clearCompanySurveyData);

// Archive old survey data
router.post('/archive-old-data', archiveOldSurveyData);

module.exports = router;