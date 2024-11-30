const xlsx = require("xlsx");
const path = require("path");

function readExcel(sheetName, range) {
  // โหลดไฟล์ Excel
  const filePath = path.join(__dirname, "../data/sample.xlsx"); // พาธไฟล์ Excel
  const workbook = xlsx.readFile(filePath);

  // เข้าถึง Sheet ที่ต้องการ
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

  // ดึงข้อมูลในช่วงเซลล์ที่กำหนด
  const data = xlsx.utils.sheet_to_json(sheet, { range });
  return data;
}

module.exports = { readExcel };
