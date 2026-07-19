// routes/User/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, checkUserEmail, registerUser, loginUser, deleteUser, forgotPassword, resetPassword } = require('../../controllers/User/userController');
const { authMiddleware } = require('../../middleware/authMiddleware'); 

router.get('/users', authMiddleware, getAllUsers);
router.delete('/by-email/:email', deleteUser);
router.post('/check-email', checkUserEmail);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;