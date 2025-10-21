const express = require('express');
const router = express.Router();
const userController = require('../../controllers/User/userController');

// Route to get all users (for UserList.vue)
router.get('/users', userController.getAllUsers);

// Route to check if email exists (for LoginEvaluator.vue)
router.post('/check-email', userController.checkUserEmail);

// Route to register a new user (for EvaluatorRegistration.vue)
router.post('/register', userController.registerUser);

module.exports = router;