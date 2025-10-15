// routes/config.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const permit = require('../middlewares/role.middleware');
const { setOfficeLocation, getConfig } = require('../controllers/config.controller');

router.post('/office', auth, permit('Admin'), setOfficeLocation);
router.get('/', auth, getConfig);

module.exports = router;
