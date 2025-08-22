const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authController = require('../controllers/authController');

// Protect all routes
router.use(authController.protect);

// Public routes (for authenticated users)
router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSession);
router.post('/:id/join', sessionController.joinSession);

// Faculty and Admin only routes
router.use(authController.restrictTo('faculty', 'admin'));
router.post('/', sessionController.createSession);
router.patch('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

// Admin only routes
router.use(authController.restrictTo('admin'));
router.get('/stats/overview', sessionController.getSessionStats);

module.exports = router; 