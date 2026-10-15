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
<<<<<<< HEAD
 * POST /api/users/me/password
 */
router.post('/me/password', authenticate, userController.changeMyPassword);

/**
=======
>>>>>>> d727210a0516bfa64868a75374be255d532264a2
 * GET /api/users/:id (self or admin)
 */
router.get('/:id', authenticate, userController.getById);

module.exports = router;
