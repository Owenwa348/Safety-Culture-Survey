// routes/Assessment/assessmentRoutes.js
const express = require('express');
const router = express.Router();
const { getAssessmentData } = require('../../controllers/Assessment/assessmentController');

router.get('/', getAssessmentData);

module.exports = router;
