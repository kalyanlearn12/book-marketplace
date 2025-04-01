const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get current user profile
router.get('/me', authMiddleware.authenticate, userController.getCurrentUser);

// Get user's listed books
router.get('/:id/books', authMiddleware.authenticate, userController.getUserBooks);

module.exports = router;