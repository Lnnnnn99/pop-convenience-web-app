const express = require("express");
const { readExcel } = require("./excel");

const app = express();

// API สำหรับดึงข้อมูลจาก Excel
app.get("/api/excel", async (req, res) => {
  try {
    const sheetName = req.query.sheet || "Sheet1"; // ค่าเริ่มต้น Sheet1
    const range = req.query.range || undefined; // ไม่มีช่วงระบุ = ดึงทั้งหมด
    const data = readExcel(sheetName, range);
    res.json({ data });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error reading Excel file");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
