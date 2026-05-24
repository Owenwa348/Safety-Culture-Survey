// routes/Company/companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/Company/companyController');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.get('/', companyController.getAllCompanies);
router.post('/', companyController.createCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

// เพิ่ม route ใหม่ ต้องวางก่อน /:id เพื่อไม่ให้ชน
router.get('/groups', authMiddleware, companyController.getGroups);

module.exports = router;