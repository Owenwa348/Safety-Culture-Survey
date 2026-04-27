// routes/Admin/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/authMiddleware');
const {
  addAdmin,
  getAllAdmins,
  checkAdminEmail,
  setupAdminAccount,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
  adminLogin,
  verifyAdminForPasswordReset,
  resetAdminPassword,
} = require('../../controllers/Admin/adminAuthController');

// ─── Public routes (ไม่ต้อง login) ───────────────────────
router.post('/login', adminLogin);
router.post('/check-email', checkAdminEmail);
router.put('/setup-account', setupAdminAccount);
router.post('/verify-reset', verifyAdminForPasswordReset);
router.put('/reset-password', resetAdminPassword);

// ─── Protected routes (ต้องมี Token) ──────────────────────
router.post('/add', authMiddleware, addAdmin);
router.get('/list', authMiddleware, getAllAdmins);
router.put('/update/:id', authMiddleware, updateAdmin);
router.put('/status/:id', authMiddleware, toggleAdminStatus);
router.delete('/delete/:id', authMiddleware, deleteAdmin);

module.exports = router;