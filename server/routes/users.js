const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ data: { user } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', data: { user } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ data: { users } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID (admin only)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ data: { user } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Get all faculty members
router.get('/faculty', protect, async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('_id fullName department facultyId')
      .sort('fullName');

    res.json({
      status: 'success',
      data: {
        faculty
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching faculty members'
    });
  }
});

module.exports = router; 