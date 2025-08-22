const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes
router.use(restrictTo('admin')); // Restrict to admin only

router.get('/', statisticsController.getStatistics);
router.get('/students', statisticsController.getFilteredStudents);

module.exports = router; 