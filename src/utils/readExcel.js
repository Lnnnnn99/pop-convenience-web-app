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


export const readExcelAsJson = async (path, sheetName = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const availableSheets = workbook.SheetNames;

      // ตรวจสอบว่า Sheet มีอยู่หรือไม่
      if (!sheetName) {
        sheetName = availableSheets[0]; // ใช้ Sheet แรกเป็นค่าเริ่มต้น
      } else if (!availableSheets.includes(sheetName)) {
        reject(
          `Sheet "${sheetName}" does not exist. Available sheets: ${availableSheets.join(
            ", "
          )}`
        );
        return;
      }

      const worksheet = workbook.Sheets[sheetName];
      const arrayData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // ตรวจสอบว่ามีข้อมูลใน Sheet หรือไม่
      if (arrayData.length < 2) {
        reject("Sheet must have at least a header row and one data row.");
        return;
      }

      // แยก header และข้อมูล
      const [headerRow, ...dataRows] = arrayData;

      // ตรวจสอบว่ามี header ที่คาดหวังหรือไม่
      if (
        !["key", "value", "type"].every((col) => headerRow.includes(col))
      ) {
        reject('Sheet must contain "key", "value", and "type" columns.');
        return;
      }

      // หาค่า index ของ key, value, type
      const keyIndex = headerRow.indexOf("key");
      const valueIndex = headerRow.indexOf("value");
      const typeIndex = headerRow.indexOf("type");

      // ฟังก์ชันแปลงค่าตามชนิดข้อมูล
      const parseValue = (value, type) => {
        switch (type.toLowerCase()) {
          case "int":
            return parseInt(value, 10);
          case "number":
          case "double":
            return parseFloat(value);
          case "array":
            try {
              return JSON.parse(value); // แปลงเป็น array
            } catch {
              return value.split(",").map((v) => v.trim());
            }
          case "object":
            try {
              return JSON.parse(value); // แปลงเป็น object
            } catch {
              return {}; // คืนค่าว่างหากแปลงไม่ได้
            }
          case "array of objects":
            try {
              const parsed = JSON.parse(value);
              if (Array.isArray(parsed) && parsed.every((item) => typeof item === "object")) {
                return parsed; // คืนค่า array of objects
              }
              return []; // ถ้าไม่ใช่ array of objects คืนค่าว่าง
            } catch {
              return []; // ถ้าแปลงไม่ได้ คืนค่าว่าง
            }
          default:
            return value; // คืนค่าเดิมหากไม่มีชนิดข้อมูลที่รองรับ
        }
      };

      // แปลงข้อมูลเป็น Object
      const jsonData = dataRows.reduce((result, row) => {
        const key = row[keyIndex];
        const value = row[valueIndex];
        const type = row[typeIndex];

        if (key) {
          result[key] = parseValue(value, type);
        }

        return result;
      }, {});

      resolve(jsonData);
    } catch (error) {
      reject(`Error reading Excel file: ${error.message}`);
    }
  });
};