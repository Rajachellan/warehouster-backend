const { Parser } = require('json2csv');

const toCSV = (data, fields) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

module.exports = { toCSV };
