// routes/Company/companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/Company/companyController');
const { authMiddleware } = require('../../middleware/authMiddleware');

// ✅ Public routes — ต้องอยู่ก่อน /:id เพื่อไม่ให้ Express จับเป็น param
// ใช้ใน EvaluatorRegistration เพื่อ resolve companyId จากชื่อบริษัท
router.get('/public/by-name', companyController.getCompanyByName);

// Protected routes
router.get('/groups', authMiddleware, companyController.getGroups);

// CRUD routes
router.get('/',      companyController.getAllCompanies);
router.post('/',     companyController.createCompany);
router.put('/:id',   companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;