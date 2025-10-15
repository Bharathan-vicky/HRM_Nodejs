// controllers/config.controller.js
const Config = require('../models/Config.model');

exports.setOfficeLocation = async (req, res) => {
  try {
    const { latitude, longitude, radiusMeters } = req.body;
    if (latitude == null || longitude == null) return res.status(400).json({ message: 'latitude & longitude required' });

    let cfg = await Config.findOne();
    if (!cfg) {
      cfg = await Config.create({ officeLocation: { latitude, longitude, radiusMeters } });
    } else {
      cfg.officeLocation = { latitude, longitude, radiusMeters };
      await cfg.save();
    }
    res.json({ message: 'Office location set', config: cfg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConfig = async (req, res) => {
  const cfg = await Config.findOne();
  res.json({ config: cfg });
};
