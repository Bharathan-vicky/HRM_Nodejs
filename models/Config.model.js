// models/Config.model.js
const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  officeLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    radiusMeters: { type: Number, default: 100 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Config', configSchema);
