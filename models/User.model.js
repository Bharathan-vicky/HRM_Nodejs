// models/User.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  designation: { type: String },
  department: { type: String },
  dateOfJoining: { type: Date },
  role: { type: String, enum: ['admin','employee'], default: 'employee' },
  password: { type: String, required: true },
  refreshToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
