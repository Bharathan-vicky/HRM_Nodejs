// utils/export.util.js
const { Parser } = require('json2csv');

const jsonToCsv = (data) => {
  if (!data || !data.length) return '';
  const fields = Object.keys(data[0]);
  const parser = new Parser({ fields });
  return parser.parse(data);
};

module.exports = { jsonToCsv };
