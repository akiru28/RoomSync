const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/users/me
 */
router.get('/me', authenticate, userController.getMe);

/**
 * PATCH /api/users/me
 */
router.patch('/me', authenticate, userController.updateMe);

/**
 * POST /api/users/me/password
 */
router.post('/me/password', authenticate, userController.changeMyPassword);

/**
 * GET /api/users/:id (self or admin)
 */
router.get('/:id', authenticate, userController.getById);

module.exports = router;
