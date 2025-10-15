// controllers/employee.controller.js
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, designation, department, dateOfJoining, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'name, email, password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email exists' });

    const hashed = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '10'));
    const user = await User.create({
      name, email, phone, designation, department, dateOfJoining, role: role || 'Employee', password: hashed
    });

    res.status(201).json({ message: 'Employee created', user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, parseInt(process.env.SALT_ROUNDS || '10'));
    }
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, q } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { department: new RegExp(q, 'i') },
        { designation: new RegExp(q, 'i') }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
    res.json({ total, page: parseInt(page), pages: Math.ceil(total / limit), users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
