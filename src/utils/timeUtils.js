export const fetchServerTime = async () => {
    try {
        const response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Bangkok");
        const data = await response.json();
        return new Date(data.utc_datetime); // เวลาปัจจุบันจากเซิร์ฟเวอร์ (UTC)
    } catch (error) {
        console.error("Error fetching server time:", error);
        return null;
    }
};
  