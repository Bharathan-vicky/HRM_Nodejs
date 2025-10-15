// utils/geo.util.js
const geolib = require('geolib');

const isWithinRadius = ({ lat1, lon1 }, { lat2, lon2 }, radiusMeters) => {
  const isInside = geolib.isPointWithinRadius(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 },
    radiusMeters
  );
  const distance = geolib.getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  );
  return { isInside, distance };
};

module.exports = { isWithinRadius };
