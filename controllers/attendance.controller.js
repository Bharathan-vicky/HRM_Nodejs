// controllers/attendance.controller.js
const Attendance = require('../models/Attendance.model');
const Config = require('../models/Config.model');
const User = require('../models/User.model');
const { isWithinRadius } = require('../utils/geo.util');
const { jsonToCsv } = require('../utils/export.util');

const formatDateKey = (date = new Date()) => {
  const d = new Date(date);
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth()+1).padStart(2,'0');
  const DD = String(d.getDate()).padStart(2,'0');
  return `${YYYY}-${MM}-${DD}`;
};

exports.checkIn = async (req, res) => {
  try {
    const user = req.user;
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) return res.status(400).json({ message: 'latitude & longitude required' });

    const config = await Config.findOne();
    if (!config || !config.officeLocation) return res.status(400).json({ message: 'Office location not set' });

    const { isInside, distance } = isWithinRadius(
      { lat1: latitude, lon1: longitude },
      { lat2: config.officeLocation.latitude, lon2: config.officeLocation.longitude },
      config.officeLocation.radiusMeters || 100
    );

    if (!isInside) return res.status(400).json({ message: `You are outside office radius. Distance: ${distance} meters` });

    const todayKey = formatDateKey();
    let att = await Attendance.findOne({ user: user._id, date: todayKey });
    if (!att) {
      att = await Attendance.create({
        user: user._id,
        checkInAt: new Date(),
        checkInLocation: { latitude, longitude },
        date: todayKey
      });
    } else {
      if (att.checkInAt) return res.status(400).json({ message: 'Already checked in' });
      att.checkInAt = new Date();
      att.checkInLocation = { latitude, longitude };
      await att.save();
    }

    res.json({ message: 'Checked in', attendance: att });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const user = req.user;
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) return res.status(400).json({ message: 'latitude & longitude required' });

    const config = await Config.findOne();
    if (!config || !config.officeLocation) return res.status(400).json({ message: 'Office location not set' });

    const { isInside, distance } = isWithinRadius(
      { lat1: latitude, lon1: longitude },
      { lat2: config.officeLocation.latitude, lon2: config.officeLocation.longitude },
      config.officeLocation.radiusMeters || 100
    );

    if (!isInside) return res.status(400).json({ message: `You are outside office radius. Distance: ${distance} meters` });

    const todayKey = formatDateKey();
    let att = await Attendance.findOne({ user: user._id, date: todayKey });
    if (!att || !att.checkInAt) return res.status(400).json({ message: 'No check-in found for today' });

    if (att.checkOutAt) return res.status(400).json({ message: 'Already checked out' });

    att.checkOutAt = new Date();
    att.checkOutLocation = { latitude, longitude };
    await att.save();
    res.json({ message: 'Checked out', attendance: att });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page)-1)*parseInt(limit);
    const total = await Attendance.countDocuments({ user: req.user._id });
    const rows = await Attendance.find({ user: req.user._id }).sort({ date: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ total, page: parseInt(page), pages: Math.ceil(total/limit), rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: view all attendance with filters
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, employee, date, department, download } = req.query;
    const filter = {};
    if (employee) filter.user = employee;
    if (date) filter.date = date;
    if (department) {
      const users = await User.find({ department }).select('_id');
      filter.user = { $in: users.map(u => u._id) };
    }

    const skip = (parseInt(page)-1)*parseInt(limit);
    const total = await Attendance.countDocuments(filter);
    const rows = await Attendance.find(filter).populate('user', '-password').sort({ date: -1 }).skip(skip).limit(parseInt(limit));

    if (download === 'csv' || download === 'json') {
      const plain = rows.map(r => ({
        id: r._id,
        user: r.user ? r.user.email : r.user,
        name: r.user ? r.user.name : '',
        department: r.user ? r.user.department : '',
        date: r.date,
        checkInAt: r.checkInAt,
        checkOutAt: r.checkOutAt,
        status: r.status
      }));
      if (download === 'json') {
        return res.json(plain);
      } else {
        const csv = jsonToCsv(plain);
        res.header('Content-Type', 'text/csv');
        res.attachment(`attendance_${Date.now()}.csv`);
        return res.send(csv);
      }
    }

    res.json({ total, page: parseInt(page), pages: Math.ceil(total/limit), rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.dailySummary = async (req, res) => {
  try {
    const { date = formatDateKey() } = req.query;
    const all = await Attendance.find({ date }).populate('user', '-password');
    const present = all.filter(a => a.checkInAt).length;
    const absent = 0; // absent logic depends on roster; set to 0 here
    const late = all.filter(a => {
      if (!a.checkInAt) return false;
      const d = new Date(a.checkInAt);
      return d.getHours() > 9 || (d.getHours() === 9 && d.getMinutes() > 15);
    }).length;

    res.json({ date, present, absent, late });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
