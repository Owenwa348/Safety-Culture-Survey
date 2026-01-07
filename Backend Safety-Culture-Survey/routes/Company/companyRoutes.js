const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/Company/companyController');

router.get('/', companyController.getAllCompanies);

module.exports = router;
