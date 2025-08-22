/**
 * Email Service
 * 
 * Provides email functionality for the application, handling various types of
 * email notifications and communications with users.
 * 
 * Email Types:
 * - Welcome emails
 * - Verification emails
 * - Password reset
 * - Session notifications
 * - System alerts
 * - Newsletter
 * 
 * Features:
 * - HTML email templates
 * - Queue management
 * - Retry mechanism
 * - Attachment handling
 * - Template variables
 * 
 * Configuration:
 * - SMTP settings
 * - Rate limiting
 * - Template paths
 * - Sender details
 * 
 * Error Handling:
 * - SMTP errors
 * - Template errors
 * - Invalid recipients
 * - Queue failures
 * 
 * Dependencies:
 * - Nodemailer for sending emails
 * - Email templates
 * - Queue service
 * - Environment config
 * 
 * @type {module} Email handling service
 */

const nodemailer = require('nodemailer');

// Create a single transporter instance
let transporter;

const createTransporter = () => {
  if (!transporter) {
    console.log('Creating SMTP transporter...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : '***NOT SET***');
    
    transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
  }
  return transporter;
};

// Test the transporter configuration
const testTransporter = async () => {
  try {
    console.log('Testing SMTP configuration...');
    const testTransporter = createTransporter();
    
    // Verify the connection
    await testTransporter.verify();
    console.log('SMTP connection verified successfully!');
    return testTransporter;
  } catch (error) {
    console.error('SMTP configuration error:', error);
    throw error;
  }
};

// Initialize transporter
createTransporter();

// Test SMTP connection on startup
testTransporter().catch(error => {
  console.error('Failed to verify SMTP connection:', error);
});

exports.testTransporter = testTransporter;

// Simple test email function
exports.sendTestEmail = async (toEmail) => {
  try {
    console.log('Sending test email to:', toEmail);
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: 'Test Email from RGUKT Platform',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #2c3e50;">🧪 Test Email</h1>
          <p>This is a test email to verify the email service is working properly.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
          <p><strong>SMTP User:</strong> ${process.env.SMTP_USER}</p>
          <p>If you received this email, the email service is working correctly!</p>
        </div>
      `
    };

    const result = await createTransporter().sendMail(mailOptions);
    console.log('Test email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Test email error:', error);
    throw error;
  }
};

exports.sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  await createTransporter().sendMail(mailOptions);
};

exports.sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  await createTransporter().sendMail(mailOptions);
}; 

exports.sendNOCStatusEmail = async (email, studentName, status) => {
  let subject, html;
  if (status === 'accepted') {
    subject = 'Your NOC Submission Has Been Accepted';
    html = `
      <p>Dear ${studentName},</p>
      <p>Your NOC request has been <b>accepted</b>. Please meet in the department office with the following forms:</p>
      <ol>
        <li>Student Leave Application Form</li>
        <li>Application for Long Internship</li>
        <li>Letter of Undertaking for Longterm Internship Program</li>
        <li>NOC</li>
        <li>Revealing Letter for Longterm Internship Program</li>
        <li>Declaration of Parent / Guardian</li>
        <li>Offer Letter of Intern or PPO</li>
        <li>Covering Letter</li>
      </ol>
      <p>Regards,<br/>RGUKT Placement Cell</p>
    `;
  } else if (status === 'rejected') {
    subject = 'Your NOC Submission Has Been Rejected';
    html = `
      <p>Dear ${studentName},</p>
      <p>Your NOC request has been <b>rejected</b> by admin. Please contact the department office for further details.</p>
      <p>Regards,<br/>RGUKT Placement Cell</p>
    `;
  } else {
    return;
  }
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html
  };
  await createTransporter().sendMail(mailOptions);
};

exports.sendAccountCreationEmail = async (email, fullName, role) => {
  try {
    console.log('Attempting to send account creation email to:', email, 'for role:', role);
    
    let roleSpecificText = '';
    let welcomeMessage = '';
    
    switch (role) {
      case 'student':
        roleSpecificText = `
          <p>As a student, you now have access to:</p>
          <ul>
            <li>📚 Knowledge-sharing sessions with alumni and faculty</li>
            <li>💼 Placement opportunities and internship drives</li>
            <li>🎓 Career guidance and mentorship programs</li>
            <li>📖 Department-specific resources and materials</li>
            <li>🔔 Real-time notifications for new opportunities</li>
          </ul>
          <p>Stay connected with the RGUKT community and make the most of your academic journey!</p>
        `;
        welcomeMessage = 'Welcome to the RGUKT Student Community!';
        break;
      case 'alumni':
        roleSpecificText = `
          <p>As an alumni, you can now:</p>
          <ul>
            <li>🎤 Conduct knowledge-sharing sessions with current students</li>
            <li>💡 Share your industry experience and insights</li>
            <li>🤝 Mentor students in their career development</li>
            <li>📢 Post job opportunities and internship openings</li>
            <li>🌐 Stay connected with your alma mater</li>
          </ul>
          <p>Your experience is invaluable to our current students. Thank you for giving back to the RGUKT community!</p>
        `;
        welcomeMessage = 'Welcome Back to RGUKT Alumni Network!';
        break;
      case 'faculty':
        roleSpecificText = `
          <p>As a faculty member, you can now:</p>
          <ul>
            <li>📚 Conduct educational sessions and workshops</li>
            <li>🎓 Guide students in their academic and career paths</li>
            <li>📋 Approve and oversee student initiatives</li>
            <li>🔍 Monitor platform activities and ensure quality</li>
            <li>🤝 Collaborate with alumni for student development</li>
          </ul>
          <p>Your expertise is crucial in shaping the future of our students!</p>
        `;
        welcomeMessage = 'Welcome to the RGUKT Faculty Portal!';
        break;
      case 'admin':
        roleSpecificText = `
          <p>As an administrator, you can now:</p>
          <ul>
            <li>⚙️ Manage platform operations and user accounts</li>
            <li>📋 Approve session requests and NOC submissions</li>
            <li>📊 Monitor system statistics and user engagement</li>
            <li>🔔 Send notifications and announcements</li>
            <li>👥 Oversee the entire RGUKT community</li>
          </ul>
          <p>You play a vital role in maintaining the platform's integrity and functionality!</p>
        `;
        welcomeMessage = 'Welcome to RGUKT Admin Portal!';
        break;
      default:
        roleSpecificText = `
          <p>Welcome to the RGUKT community! We're excited to have you on board.</p>
        `;
        welcomeMessage = 'Welcome to RGUKT!';
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `${welcomeMessage} - Your Account Has Been Created Successfully`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin-bottom: 10px;">🎉 ${welcomeMessage}</h1>
              <p style="color: #7f8c8d; font-size: 16px;">Your account has been successfully created!</p>
            </div>
            
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #2c3e50; margin-bottom: 15px;">Account Details</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
              <p><strong>Account Status:</strong> <span style="color: #27ae60; font-weight: bold;">Active</span></p>
            </div>
            
            <div style="margin-bottom: 25px;">
              ${roleSpecificText}
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60;">
              <h3 style="color: #27ae60; margin-bottom: 10px;">🚀 Getting Started</h3>
              <p>You can now log in to your account and start exploring the platform. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; text-align: center;">
              <p style="color: #7f8c8d; font-size: 14px;">
                Best regards,<br>
                <strong>RGUKT Team</strong><br>
                Rajiv Gandhi University of Knowledge Technologies
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const result = await createTransporter().sendMail(mailOptions);
    console.log('Account creation email sent successfully to:', email, 'Result:', result);
    return result;
  } catch (error) {
    console.error('Error in sendAccountCreationEmail:', error);
    throw error;
  }
};

exports.sendSessionRequestStatusEmail = async (email, fullName, sessionTitle, status, adminContact = null) => {
  try {
    console.log('Attempting to send session request status email to:', email, 'Status:', status);
    
    let subject, statusText, statusColor, actionText;
    
    if (status === 'approved') {
      subject = 'Your Session Request Has Been Accepted!';
      statusText = 'ACCEPTED';
      statusColor = '#27ae60';
      actionText = `
        <p>Your session request has been approved by our admin team. Here are the next steps:</p>
        <ul>
          <li>📅 Prepare your session materials and presentation</li>
          <li>📧 You will receive further details about the session schedule</li>
          <li>🎯 Focus on delivering valuable content to our students</li>
          <li>📝 Consider preparing interactive elements for better engagement</li>
        </ul>
      `;
    } else if (status === 'rejected') {
      subject = 'Session Request Status Update';
      statusText = 'REJECTED';
      statusColor = '#e74c3c';
      actionText = `
        <p>We regret to inform you that your session request could not be approved at this time. This could be due to:</p>
        <ul>
          <li>📋 Incomplete information in the request</li>
          <li>📅 Scheduling conflicts with existing sessions</li>
          <li>🎯 Topic alignment with current academic priorities</li>
          <li>📝 Need for additional details or clarification</li>
        </ul>
        <p>We encourage you to review your request and consider submitting a new one with additional details.</p>
      `;
    } else {
      console.log('Invalid status for session request email:', status);
      return;
    }

    const adminContactInfo = adminContact ? `
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 20px;">
        <h4 style="color: #856404; margin-bottom: 10px;">📞 Contact Admin for Details</h4>
        <p style="color: #856404; margin-bottom: 5px;"><strong>Admin Email:</strong> ${adminContact.email}</p>
        ${adminContact.phone ? `<p style="color: #856404; margin-bottom: 5px;"><strong>Admin Phone:</strong> ${adminContact.phone}</p>` : ''}
        <p style="color: #856404; font-size: 14px;">Feel free to reach out for any clarification or additional information.</p>
      </div>
    ` : '';

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin-bottom: 10px;">📋 Session Request Update</h1>
              <p style="color: #7f8c8d; font-size: 16px;">Your session request status has been updated</p>
            </div>
            
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #2c3e50; margin-bottom: 15px;">Request Details</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Session Title:</strong> ${sessionTitle}</p>
              <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold; font-size: 18px;">${statusText}</span></p>
            </div>
            
            <div style="margin-bottom: 25px;">
              ${actionText}
            </div>
            
            ${adminContactInfo}
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60;">
              <h3 style="color: #27ae60; margin-bottom: 10px;">💡 Tips for Future Requests</h3>
              <ul style="color: #2c3e50;">
                <li>📝 Provide detailed session descriptions</li>
                <li>🎯 Include learning objectives and outcomes</li>
                <li>⏰ Suggest multiple time slots if possible</li>
                <li>📚 Mention any special requirements or materials</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; text-align: center;">
              <p style="color: #7f8c8d; font-size: 14px;">
                Thank you for your contribution to the RGUKT community!<br>
                <strong>RGUKT Team</strong><br>
                Rajiv Gandhi University of Knowledge Technologies
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('Mail options prepared for session request status:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      status: status
    });

    const result = await createTransporter().sendMail(mailOptions);
    console.log('Session request status email sent successfully to:', email, 'Result:', result);
    return result;
  } catch (error) {
    console.error('Error in sendSessionRequestStatusEmail:', error);
    throw error;
  }
}; 

exports.sendOTPEmail = async (email, fullName, otp) => {
  try {
    console.log('Attempting to send OTP email to:', email, 'OTP:', otp);
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Email Verification - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin-bottom: 10px;">🔐 Email Verification</h1>
              <p style="color: #7f8c8d; font-size: 16px;">Please verify your email address to complete your registration</p>
            </div>
            
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #2c3e50; margin-bottom: 15px;">Hello ${fullName}!</h2>
              <p style="color: #2c3e50; margin-bottom: 20px;">Thank you for registering with RGUKT Alumni Portal. To complete your registration, please use the verification code below:</p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 25px; border-radius: 8px; border: 2px solid #27ae60; text-align: center; margin-bottom: 25px;">
              <h3 style="color: #27ae60; margin-bottom: 15px; font-size: 18px;">Your Verification Code</h3>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 2px dashed #27ae60; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
              </div>
              <p style="color: #7f8c8d; font-size: 14px; margin-top: 15px;">This code will expire in 10 minutes</p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
              <h3 style="color: #856404; margin-bottom: 10px;">⚠️ Important Security Notice</h3>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li>Never share this code with anyone</li>
                <li>RGUKT will never ask for this code via phone or email</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; text-align: center;">
              <p style="color: #7f8c8d; font-size: 14px;">
                Best regards,<br>
                <strong>RGUKT Team</strong><br>
                Rajiv Gandhi University of Knowledge Technologies
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('OTP mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const result = await createTransporter().sendMail(mailOptions);
    console.log('OTP email sent successfully to:', email, 'Result:', result);
    return result;
  } catch (error) {
    console.error('Error in sendOTPEmail:', error);
    throw error;
  }
}; 