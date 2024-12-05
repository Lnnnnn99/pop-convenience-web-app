
export const readExcelAsList = async (csvUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(csvUrl);
      const csvText = await response.text();

      const rows = csvText.split("\n").map((row) => row.split(","));

      // ลบเครื่องหมายคำพูดจาก headerRow
      const [rawHeaderRow, ...dataRows] = rows;
      const headerRow = rawHeaderRow.map((header) => header.replace(/^"|"$/g, "")); // ลบเครื่องหมายคำพูด

      const jsonData = dataRows.map((row) =>
        headerRow.reduce((obj, header, index) => {
          obj[header] = parseValueWithoutType(row[index]?.trim() || ""); // ใช้ parseValue แปลงค่า
          return obj;
        }, {})
      );

      resolve(jsonData);
    } catch (error) {
      reject(`Error reading CSV: ${error.message}`);
    }
  });
};

const parseValueWithoutType = (value) => {
  // ลบเครื่องหมายคำพูดซ้อน (ถ้ามี)
  const cleanedValue = value.replace(/^"|"$/g, "");

  // ตรวจสอบว่าเป็นตัวเลขหรือไม่
  if (!isNaN(cleanedValue)) {
    return Number(cleanedValue); // แปลงเป็น Number
  }

  // ตรวจสอบว่าเป็น Boolean หรือไม่
  if (cleanedValue.toLowerCase() === "true") return true;
  if (cleanedValue.toLowerCase() === "false") return false;

  // คืนค่าเป็น String ปกติ
  return cleanedValue;
};

const parseValue = (value, type) => {
  switch (type.toLowerCase()) {
    case "number":
      return parseFloat(value);
    case "string":
      return value;
    default:
      return value; // คืนค่าเดิมหากไม่รองรับ
  }
};

const parseKeyValueData = (data) => {
  const result = {};

  Object.entries(data).forEach(([key, value]) => {
    const isArrayKey = key.includes("[") && key.includes("]");

    if (isArrayKey) {
      // แยก mainKey และ index
      const [mainKey, restKey] = key.split(/\[(\d+)\]\.?/).filter(Boolean);
      const index = parseInt(restKey, 10);

      // สร้างโครงสร้าง Array หากยังไม่มี
      if (!result[mainKey]) {
        result[mainKey] = [];
      }

      // จัดการ Array of Objects
      if (key.includes(".")) {
        const [, subKey] = key.split(".");
        if (!result[mainKey][index]) {
          result[mainKey][index] = {};
        }
        result[mainKey][index][subKey] = value;
      } else {
        // จัดการ Array ธรรมดา
        result[mainKey][index] = value;
      }
    } else {
      // กรณี Key ธรรมดา
      result[key] = value;
    }
  });

  return result;
};


export const readExcelAsJson = async (csvUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(csvUrl);

      if (!response.ok) {
        reject(`Failed to fetch the CSV file: ${response.statusText}`);
        return;
      }

      const csvText = await response.text();

      // แปลง CSV เป็น Array ของ Rows
      const rows = csvText.split("\n").map((row) => row.split(","));

      if (rows.length < 2) {
        reject("The CSV must have at least a header row and one data row.");
        return;
      }

      // แยก header และข้อมูล
      const [headerRow, ...dataRows] = rows;

      // ลบเครื่องหมายคำพูดและ Trim header
      const header = headerRow.map((h) => h.replace(/^"|"$/g, "").trim());

      // ตรวจสอบว่ามี header "key", "value", "type"
      if (!["key", "value", "type"].every((col) => header.includes(col))) {
        reject('CSV must contain "key", "value", and "type" columns.');
        return;
      }

      // หาค่า index ของ key, value, type
      const keyIndex = header.indexOf("key");
      const valueIndex = header.indexOf("value");
      const typeIndex = header.indexOf("type");

      // ฟังก์ชันแปลงค่าตามชนิดข้อมูล
      const parseValue = (value, type) => {
        const cleanedValue = value.replace(/^"|"$/g, "").trim();
        switch (type.toLowerCase()) {
          case "number":
            return parseFloat(cleanedValue);
          case "string":
            return cleanedValue;
          default:
            return null; // หากไม่ใช่ string หรือ number
        }
      };

      // แปลงข้อมูลเป็น JSON Object
      const jsonData = dataRows.reduce((result, row) => {
        const key = row[keyIndex]?.replace(/^"|"$/g, "").trim();
        const value = row[valueIndex]?.replace(/^"|"$/g, "").trim();
        const type = row[typeIndex]?.replace(/^"|"$/g, "").trim();

        if (key && (type === "string" || type === "number")) {
          result[key] = parseValue(value, type);
        }

        return result;
      }, {});

      const parsedData = parseKeyValueData(jsonData);


      resolve(parsedData);
    } catch (error) {
      reject(`Error reading Google Sheet CSV: ${error.message}`);
    }
  });
};

export const generateGoogleSheetCSVUrl = (sheetId, sheetName) => {
  if (!sheetId || !sheetName) {
    throw new Error("Both sheetId and sheetName are required.");
  }
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
};