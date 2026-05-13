const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { pool } = require('../db');

const router = express.Router();

// ==========================================
// POST /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
    const validRoles = ['user', 'office_member'];
    const userRole = validRoles.includes(role) ? role : 'user';

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, userRole]
    );

    console.log(`✅ New user registered: ${email} (role: ${userRole})`);

    res.status(201).json({
      message: 'Registration successful',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ==========================================
// POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'concode_super_secret_key_2026',
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;

// ==========================================
// POST /api/auth/forgot-password
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const user = users[0];

    // Generate random 8-char password
    const newPassword = Math.random().toString(36).slice(-8);

    // Hash it and update DB
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pool.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    // Configure email transporter
    let transporter;
    
    // If real Gmail credentials are provided in .env, use them to send to actual inbox
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Fallback to Ethereal testing service if no real credentials are provided
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Beautiful HTML template
    const htmlEmail = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; padding: 40px 0; color: #e2e8f0;">
        <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155;">
          <div style="background-color: #2563eb; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">CONCORD</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Real Estate Dashboard</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #f8fafc; margin-top: 0;">Password Reset Complete</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Hello <strong>${user.full_name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">We received a request to reset the password for your Concord account associated with this email address.</p>
            <div style="background-color: #0f172a; border: 1px solid #334155; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Your New Password</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #f8fafc; letter-spacing: 4px;">${newPassword}</p>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">Please log in using this new password. We highly recommend changing it immediately from your account settings once you log in.</p>
          </div>
          <div style="background-color: #0f172a; padding: 20px 30px; text-align: center; border-top: 1px solid #334155;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">If you did not request this change, please contact support immediately.</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #64748b;">&copy; 2026 Concord Real Estate.</p>
          </div>
        </div>
      </div>
    `;

    let info = await transporter.sendMail({
      from: '"Concord Support" <support@concordrealestatebd.com>',
      to: email,
      subject: "Your New Concord Account Password",
      html: htmlEmail,
    });

    let previewUrl = null;
    if (!process.env.EMAIL_USER) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("✅ Forgot Password Test Email sent. Preview URL: %s", previewUrl);
    } else {
      console.log("✅ Real Forgot Password Email sent to %s", email);
    }

    res.json({ 
      message: 'Password has been sent to your email', 
      previewUrl,
      isRealEmail: !!process.env.EMAIL_USER
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});
