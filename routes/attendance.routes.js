// routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const permit = require('../middlewares/role.middleware');
const attendanceCtrl = require('../controllers/attendance.controller');

router.post('/checkin', auth, permit('Employee','Admin'), attendanceCtrl.checkIn);
router.post('/checkout', auth, permit('Employee','Admin'), attendanceCtrl.checkOut);
router.get('/me', auth, permit('Employee','Admin'), attendanceCtrl.getMyHistory);

// Admin endpoints
router.get('/', auth, permit('Admin'), attendanceCtrl.getAll);
router.get('/summary/daily', auth, permit('Admin'), attendanceCtrl.dailySummary);

module.exports = router;
