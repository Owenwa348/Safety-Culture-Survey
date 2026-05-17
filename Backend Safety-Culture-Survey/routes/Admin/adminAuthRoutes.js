// routes/Admin/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
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
  downloadAdminTemplate,
  uploadAdminExcel,
} = require('../../controllers/Admin/adminAuthController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (file.mimetype === allowed) {
      cb(null, true);
    } else {
      cb(new Error('อนุญาตเฉพาะไฟล์ .xlsx เท่านั้น'), false);
    }
  },
});

// ─── Public routes ───────────────────────────────────────────
router.post('/login', adminLogin);
router.post('/check-email', checkAdminEmail);
router.put('/setup-account', setupAdminAccount);
router.post('/verify-reset', verifyAdminForPasswordReset);
router.put('/reset-password', resetAdminPassword);

// ─── Protected routes ────────────────────────────────────────
router.post('/add', authMiddleware, addAdmin);
router.get('/list', authMiddleware, getAllAdmins);
router.put('/update/:id', authMiddleware, updateAdmin);
router.put('/status/:id', authMiddleware, toggleAdminStatus);
router.delete('/delete/:id', authMiddleware, deleteAdmin);

// ─── Excel Import/Export ─────────────────────────────────────
router.get('/template', authMiddleware, downloadAdminTemplate);
router.post('/upload', authMiddleware, upload.single('file'), uploadAdminExcel);

module.exports = router;