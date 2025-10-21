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
} = require('../../controllers/SuperAdmin/superAdminController');

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

// Route to update or delete a super admin by ID
router.route('/:id')
  .put(updateSuperAdmin)
  .delete(deleteSuperAdmin);

// Route to update status
router.put('/:id/status', updateSuperAdminStatus);

module.exports = router;
