const express = require('express');
const router = express.Router();
const { 
  sendOTP, 
  verifyOTP, 
  resendOTP,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resendPasswordResetOTP
} = require('../controllers/otpController');

// Signup OTP routes
router.post('/send', sendOTP);
router.post('/verify', verifyOTP);
router.post('/resend', resendOTP);

// Password reset OTP routes
router.post('/password-reset/send', sendPasswordResetOTP);
router.post('/password-reset/verify', verifyPasswordResetOTP);
router.post('/password-reset/resend', resendPasswordResetOTP);

module.exports = router; 