// scripts/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const connectDB = require('../config/db');

(async () => {
  try {
    await connectDB();
    const email = 'admin@example.com';
    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    const hashed = await bcrypt.hash('Admin@123', parseInt(process.env.SALT_ROUNDS || '10'));
    const admin = new User({ name: 'Admin', email, password: hashed, role: 'Admin' });
    await admin.save();
    console.log('Admin created:', email, 'password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
