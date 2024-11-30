const express = require('express');
const { google } = require('googleapis');
const drive = require('./google-api/drive');
const sheets = require('./google-api/sheets');

const app = express();
app.use(express.json());
app.use(express.static('public')); // เสิร์ฟไฟล์ static เช่น HTML, CSS, JS

// ตัวอย่าง Route
app.get('/api/files', async (req, res) => {
  const files = await drive.listFiles();
  res.json(files);
});

app.get('/api/sheets', async (req, res) => {
  const sheetData = await sheets.getSheetData('SHEET_ID', 'Sheet1');
  res.json(sheetData);
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
