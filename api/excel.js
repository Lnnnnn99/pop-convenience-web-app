const xlsx = require("xlsx");
const path = require("path");

function readExcel(sheetName, range) {
  const filePath = path.join(__dirname, "../data/sample.xlsx");
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
  return xlsx.utils.sheet_to_json(sheet, { range });
}

module.exports = { readExcel };
