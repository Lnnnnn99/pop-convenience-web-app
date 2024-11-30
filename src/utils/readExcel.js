import * as XLSX from "xlsx";

/**
 * ฟังก์ชันสำหรับอ่านไฟล์ Excel
 * @param {File} file - ไฟล์ Excel ที่ผู้ใช้เลือก
 * @returns {Promise<Array>} - Promise ที่คืนค่าเป็น Array ของข้อมูล JSON
 */
export const readExcel = async (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ดึงไฟล์ Excel จากโฟลเดอร์ public
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer(); // แปลงไฟล์เป็น ArrayBuffer
      const workbook = XLSX.read(arrayBuffer, { type: "array" }); // อ่านไฟล์ Excel
      const sheetName = workbook.SheetNames[0]; // ดึงชื่อ Sheet แรก
      const worksheet = workbook.Sheets[sheetName]; // ดึงข้อมูลของ Sheet
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // แปลงข้อมูลเป็น Array
      resolve(jsonData); // เก็บข้อมูลใน State
    } catch (error) {
      reject(`Error reading Excel file: ${error.message}`);
    }
  });
};
