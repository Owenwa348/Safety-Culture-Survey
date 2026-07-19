// routes/SuperAdmin/superAdminRoutes.js
const express = require('express');
const router = express.Router();
const {
  addSuperAdmin,
  getAllSuperAdmins,
  checkEmailAndStatus,
  setupAccount,
  login,
  updateSuperAdmin,
  deleteSuperAdmin,
  updateSuperAdminStatus,
  verifyForPasswordReset,
  resetPassword,
} = require('../../controllers/SuperAdmin/superAdminController');

// ✅ ฟังก์ชันจัดการ assessment ย้ายไปอยู่ที่ assessmentController แล้ว
// (เป็น business logic ของ survey_answer / survey_status เหมือนฟังก์ชันอื่นในไฟล์นั้น)
// แต่ยัง mount route ไว้ที่เดิมภายใต้ /super-admins เพื่อไม่ให้ frontend ต้องแก้ URL
const {
  clearAssessmentDataByCompany,
  getAssessmentStatsByCompany,
} = require('../../controllers/Assessment/assessmentController');

// Route to get all super admins and add a new one
router.route('/')
  .get(getAllSuperAdmins)
  .post(addSuperAdmin);

// Route to check email status before setting password
router.post('/check-email', checkEmailAndStatus);

// Route for the initial account setup (setting password, pin, etc.)
router.post('/setup', setupAccount);

// Route for login
router.post('/login', login);

// Route to verify SuperAdmin for password reset (check email, phone, PIN)
router.post('/verify-for-reset', verifyForPasswordReset);

// Route to reset password for SuperAdmin
router.post('/reset-password', resetPassword);

// Route to update or delete a super admin by ID
router.route('/:id')
  .put(updateSuperAdmin)
  .delete(deleteSuperAdmin);

// Route to update status
router.put('/:id/status', updateSuperAdminStatus);

// Route to clear assessment data by company
router.delete('/assessment/clear/:companyId', clearAssessmentDataByCompany);

// Route to get assessment stats before clearing
router.get('/assessment/stats/:companyId', getAssessmentStatsByCompany);

module.exports = router;