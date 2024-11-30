const express = require("express");
const { readExcel } = require("./excel");

const app = express();

// API สำหรับดึงข้อมูลจาก Excel
app.get("/api/excel", async (req, res) => {
  try {
    const sheetName = req.query.sheet || "Sheet1";
    const range = req.query.range || undefined;
    const data = readExcel(sheetName, range);
    res.json({ data });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = app;
