const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const PlacementDrive = require('../models/PlacementDrive');

// Get all placement drives (public)
router.get('/', async (req, res) => {
  try {
    const drives = await PlacementDrive.find().sort({ dateOfDrive: -1 });
    res.json({ success: true, data: { drives } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new placement drive (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { companyName, package, role, requirements, dateOfDrive, bond, stipend, description,targetDepartments
    } = req.body;
    const drive = await PlacementDrive.create({ companyName, package, role, requirements, dateOfDrive, bond, stipend, description,targetDepartments });
    res.status(201).json({ success: true, data: { drive } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a placement drive (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    res.json({ success: true, data: { drive } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router; 