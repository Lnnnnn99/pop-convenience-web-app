export const fetchServerTime = async () => {
    try {
      const response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Bangkok");
      const data = await response.json();
      return new Date(data.utc_datetime);
    } catch (error) {
      console.error("Error fetching server time:", error);
      return null;
    }
  };
  
  export const checkTimeDifference = async () => {
    const serverTime = await fetchServerTime(); // ดึงเวลาเซิร์ฟเวอร์
    if (!serverTime) return false;
  
    const clientTime = new Date(); // เวลาบนเครื่องผู้ใช้
  
    const timeDiff = Math.abs(serverTime - clientTime); // คำนวณความต่างระหว่างเวลา (มิลลิวินาที)
    const maxAllowedDiff = 5 * 60 * 1000; // 5 นาทีในหน่วยมิลลิวินาที
  
    return timeDiff <= maxAllowedDiff; // คืนค่า true หากความต่าง <= 5 นาที
  };
  
  