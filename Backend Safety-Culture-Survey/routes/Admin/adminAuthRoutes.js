const express = require('express');
const router = express.Router();
const {
  addAdmin,
  getAllAdmins,
  checkAdminEmail,
  setupAdminAccount,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} = require('../../controllers/Admin/adminAuthController');

// Route for SuperAdmin to add a new admin
// POST /api/admin/add
router.post('/add', addAdmin);

// Route for SuperAdmin to get all admins
// GET /api/admin/list
router.get('/list', getAllAdmins);

// Route for a new admin to check their email before setting up a password
// POST /api/admin/check-email
router.post('/check-email', checkAdminEmail);

// Route for a new admin to complete their account setup
// PUT /api/admin/setup-account
router.put('/setup-account', setupAdminAccount);

// Route for SuperAdmin to update an admin's details
// PUT /api/admin/update/:id
router.put('/update/:id', updateAdmin);

// Route for SuperAdmin to change an admin's status (e.g., deactivate/close account)
// PUT /api/admin/status/:id
router.put('/status/:id', toggleAdminStatus);

// Route for SuperAdmin to delete an admin
// DELETE /api/admin/delete/:id
router.delete('/delete/:id', deleteAdmin);

module.exports = router;
