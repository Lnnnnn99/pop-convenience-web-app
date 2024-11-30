const express = require("express");
const path = require("path");
const { readExcel } = require("./excel");

const app = express();

// Serve Static React Build
app.use(express.static(path.join(__dirname, "../frontend/build")));

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

module.exports = app;
