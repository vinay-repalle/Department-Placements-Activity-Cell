/**
 * Placement Routes
 * 
 * Handles all placement-related operations including submissions,
 * updates, and retrievals.
 * 
 * Routes:
 * - POST /api/placements: Submit new placement
 * - GET /api/placements/user/:userId: Get user's placements
 * - GET /api/placements: Get all placements (admin only)
 * - PUT /api/placements/:id: Update placement status (admin only)
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Placement = require('../models/Placement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendNOCStatusEmail } = require('../utils/emailService');
const ExcelJS = require('exceljs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/placements';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF, and document files are allowed!'));
    }
  }
});

// Submit new placement
router.post('/', protect, upload.fields([
  { name: 'mailScreenshot', maxCount: 1 },
  { name: 'offerLetter', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      studentName,
      idNumber,
      contact,
      year,
      company,
      type,
      position,
      package,
      location,
      joiningDate,
      additionalInfo,
      driveType
    } = req.body;

    // Handle file uploads
    const mailScreenshot = req.files?.mailScreenshot?.[0]?.filename;
    const offerLetter = req.files?.offerLetter?.[0]?.filename;

    const placementData = {
      student: req.user._id,
      studentName,
      idNumber,
      contact,
      year,
      company,
      type,
      position,
      package,
      location,
      joiningDate,
      additionalInfo,
      status: 'pending'
    };

    // Add E3/E4 specific fields
    if (year === 'E3' || year === 'E4') {
      placementData.driveType = driveType;
      if (mailScreenshot) {
        placementData.mailScreenshot = mailScreenshot;
      }
      if (offerLetter) {
        placementData.offerLetter = offerLetter;
      }
    }

    const placement = await Placement.create(placementData);
    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    if (admins.length > 0) {
      const notifications = admins
        .filter(admin => !!admin._id)
        .map(admin => ({
          recipient: admin._id,
          title: 'New NOC Submission',
          message: `${req.user.fullName} submitted a new NOC (${type}) for ${company}.`,
          type: 'terms',
          link: '/admin/noc-submissions'
        }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } else {
      console.warn('No admins found to notify for new NOC submission.');
    }

    res.status(201).json({
      success: true,
      data: { placement }
    });
  } catch (error) {
    console.error('Error submitting placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting placement'
    });
  }
});

// Get user's placements
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const placements = await Placement.find({ student: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { placements }
    });
  } catch (error) {
    console.error('Error fetching placements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching placements'
    });
  }
});

// Get all placements (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { placements }
    });
  } catch (error) {
    console.error('Error fetching all placements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching placements'
    });
  }
});

// Update placement status (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, approvalTag } = req.body;
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    // Remove requirement for approvalTag
    const updateData = { status };
    if (approvalTag) updateData.approvalTag = approvalTag;
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!placement) {
      return res.status(404).json({ success: false, message: 'Placement not found' });
    }
    // Notify the student
    if (placement.student) {
      await Notification.create({
        recipient: placement.student,
        title: 'NOC Submission Status Updated',
        message: `Your NOC submission for ${placement.company} (${placement.type}) was ${status} by admin.`,
        type: 'terms',
        link: '/studentprofile'
      });
      // Send email if accepted or rejected
      if (status === 'accepted' || status === 'rejected') {
        const studentUser = await User.findById(placement.student);
        if (studentUser && studentUser.email) {
          await sendNOCStatusEmail(studentUser.email, placement.studentName, status);
        }
      }
    }
    res.json({ success: true, data: { placement } });
  } catch (error) {
    console.error('Error updating placement:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating placement' });
  }
});

// Export placements to Excel (admin only)
router.get('/export/excel', protect, authorize('admin'), async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate('student', 'fullName email department yearOfStudy')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Placements Data');

    // Define columns
    worksheet.columns = [
      { header: 'Student Name', key: 'studentName', width: 20 },
      { header: 'Student ID', key: 'idNumber', width: 15 },
      { header: 'Contact', key: 'contact', width: 15 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Position', key: 'position', width: 20 },
      { header: 'Package/Stipend', key: 'package', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Joining Date', key: 'joiningDate', width: 15 },
      { header: 'Drive Type', key: 'driveType', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Additional Info', key: 'additionalInfo', width: 30 },
      { header: 'Submitted Date', key: 'createdAt', width: 15 }
    ];

    // Add data rows
    placements.forEach(placement => {
      worksheet.addRow({
        studentName: placement.studentName || '',
        idNumber: placement.idNumber || '',
        contact: placement.contact || '',
        year: placement.year || '',
        company: placement.company || '',
        type: placement.type || '',
        position: placement.position || '',
        package: placement.package || '',
        location: placement.location || '',
        joiningDate: placement.joiningDate || '',
        driveType: placement.driveType || '',
        status: placement.status || '',
        additionalInfo: placement.additionalInfo || '',
        createdAt: placement.createdAt ? new Date(placement.createdAt).toLocaleDateString() : ''
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=placements_data.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting placements:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting placements data'
    });
  }
});

module.exports = router; 