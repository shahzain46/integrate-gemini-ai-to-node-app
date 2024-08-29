const Otp = require('../models/Otp'); 
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if(!email) return res.status(400).send('please provide email')

  const otp = crypto.randomInt(1000, 9999).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  try {
    // Save OTP and expiry to the database
    const newOtp = new Otp({
      email,
      otp,
      otpExpiry
    })
    await newOtp.save({ email, otp, otpExpiry }); // If using separate OTP collection
    // await User.findOneAndUpdate({ email }, { otp, otpExpiry }); // If extending user schema

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${newOtp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Retrieve OTP and expiry from the database
    const otpData = await Otp.findOne({ email, otp }); // If using separate OTP collection
    // const user = await User.findOne({ email, otp }); // If extending user schema

    if (!otpData || Date.now() > otpData.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or expired.' });
    }

    // OTP is valid, proceed to password update
    res.status(200).json({ success: true, message: 'OTP verified successfully. You can now update your password.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Invalid password.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the user by email and update the password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true } // Returns the updated document
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Remove OTP record
    await Otp.deleteOne({ email });

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, error: 'Failed to update password.' });
  }
};


module.exports = {
    sendOtp,
    verifyOtp,
    updatePassword
}