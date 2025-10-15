// models/Attendance.model.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkInAt: { type: Date },
  checkOutAt: { type: Date },
  checkInLocation: {
    latitude: Number,
    longitude: Number
  },
  checkOutLocation: {
    latitude: Number,
    longitude: Number
  },
  status: { type: String, enum: ['Present','Late','Absent'], default: 'Present' },
  date: { type: String } // YYYY-MM-DD for quick filtering
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
