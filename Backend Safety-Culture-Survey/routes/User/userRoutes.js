// routes/User/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, checkUserEmail, registerUser, loginUser, deleteUser } = require('../../controllers/User/userController');

// Route to get all users (for UserList.vue)
router.get('/users', getAllUsers);

// Route to delete a user by email
router.delete('/by-email/:email', deleteUser);


// Route to check if email exists in system (for LoginEvaluator.vue)
router.post('/check-email', checkUserEmail);

// Route to register a new user (for EvaluatorRegistration.vue)
router.post('/register', registerUser);

// Route to login user (for LoginEvaluator.vue)
router.post('/login', loginUser);

module.exports = router;