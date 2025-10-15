// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, getProfile } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/profile', auth, getProfile);

module.exports = router;
