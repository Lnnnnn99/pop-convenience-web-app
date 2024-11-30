import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]); // เก็บข้อมูลจาก Excel

  useEffect(() => {
    // ฟังก์ชันอ่านไฟล์ Excel
    const fetchData = async () => {
      try {
        // ดึงไฟล์ Excel จาก Local (ใน src/data)
        const response = await fetch("/data/sample.xlsx");
        const arrayBuffer = await response.arrayBuffer(); // แปลงไฟล์เป็น ArrayBuffer
        const workbook = XLSX.read(arrayBuffer, { type: "array" }); // อ่านไฟล์ Excel
        const sheetName = workbook.SheetNames[0]; // เลือกชื่อ Sheet แรก
        const worksheet = workbook.Sheets[sheetName]; // ดึงข้อมูลของ Sheet
        const jsonData = XLSX.utils.sheet_to_json(worksheet); // แปลงข้อมูลเป็น JSON
        setData(jsonData); // เก็บข้อมูลใน State
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };

    fetchData(); // เรียกฟังก์ชันอ่านไฟล์ Excel
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Local Excel Viewer</h1>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {data.length > 0 && (
            <tr>
              {Object.keys(data[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
