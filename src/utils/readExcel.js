import * as XLSX from "xlsx";

/**
 * ฟังก์ชันสำหรับอ่านไฟล์ Excel
 * @param {File} file - ไฟล์ Excel ที่ผู้ใช้เลือก
 * @returns {Promise<Array>} - Promise ที่คืนค่าเป็น Array ของข้อมูล JSON
 */
export const readExcelAsList = async (path, sheetName = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ดึงไฟล์ Excel จากโฟลเดอร์ public
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer(); // แปลงไฟล์เป็น ArrayBuffer
      const workbook = XLSX.read(arrayBuffer, { type: "array" }); // อ่านไฟล์ Excel

      // ตรวจสอบว่ามีชื่อ Sheet ใน Workbook หรือไม่
      const availableSheets = workbook.SheetNames;

      if (!sheetName) {
        // หากไม่ได้ระบุ SheetName ให้ใช้ Sheet แรก
        sheetName = availableSheets[0];
      } else if (!availableSheets.includes(sheetName)) {
        // หาก SheetName ไม่มีใน Workbook ให้แสดงข้อผิดพลาด
        reject(`Sheet "${sheetName}" does not exist. Available sheets: ${availableSheets.join(", ")}`);
        return;
      }

      const worksheet = workbook.Sheets[sheetName]; // ดึงข้อมูลของ Sheet
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // แปลงข้อมูลเป็น Array
      resolve(jsonData); // ส่งข้อมูลกลับ
    } catch (error) {
      reject(`Error reading Excel file: ${error.message}`);
    }
  });
};


/**
 * ฟังก์ชันสำหรับอ่านไฟล์ Excel
 * @param {File} file - ไฟล์ Excel ที่ผู้ใช้เลือก
 * @returns {Promise<Array>} - Promise ที่คืนค่าเป็น Array ของข้อมูล JSON
 */
export const readExcelAsJson = async (path, sheetName = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ดึงไฟล์ Excel จากโฟลเดอร์ public
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer(); // แปลงไฟล์เป็น ArrayBuffer
      const workbook = XLSX.read(arrayBuffer, { type: "array" }); // อ่านไฟล์ Excel

      // ตรวจสอบว่ามีชื่อ Sheet ใน Workbook หรือไม่
      const availableSheets = workbook.SheetNames;

      if (!sheetName) {
        // หากไม่ได้ระบุ SheetName ให้ใช้ Sheet แรก
        sheetName = availableSheets[0];
      } else if (!availableSheets.includes(sheetName)) {
        // หาก SheetName ไม่มีใน Workbook ให้แสดงข้อผิดพลาด
        reject(`Sheet "${sheetName}" does not exist. Available sheets: ${availableSheets.join(", ")}`);
        return;
      }

      const worksheet = workbook.Sheets[sheetName]; // ดึงข้อมูลของ Sheet
      const arrayData = XLSX.utils.sheet_to_csv(worksheet); // แปลงข้อมูลเป็น Array
      const jsonData = arrayData
        .split('\n')
        .map((o) => o.split(','))
        .reduce((a, v) => ({...a, [v[0]]: v[1]}), {})
        
      resolve(jsonData); // ส่งข้อมูลกลับ
    } catch (error) {
      reject(`Error reading Excel file: ${error.message}`);
    }
  });
};
