const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const CLIENT_URL = process.env.CLIENT_URL;

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ firstName, lastName, email, password, isActive: false });

    const activationToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Account Activation',
      html: `<p>Click <a href="${process.env.CLIENT_URL}/activate/${activationToken}">here</a> to activate your account.</p>`,
    };

    await transporter.sendMail(mailOptions);

    await user.save();
    res.send('Registration successful, please check your email for activation link');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.activate = async (req, res) => {
  const { token } = req.body;
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send('Invalid token');

    user.isActive = true;
    await user.save();
    res.send('Account activated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Create JWT token
      const payload = {
        userId: user._id,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Set token as cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None', 
      });
  
  
      res.json({ token, msg: 'Login successful' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const resetToken = uuidv4();
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset',    
      html: `<p>Click <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
    await user.save();
    res.send('Password reset link sent to your email');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  const {token} = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.send('Password reset successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
