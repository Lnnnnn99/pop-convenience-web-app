import React, { useState, useEffect } from "react";
import "./BetaBanner.css";

const BetaBanner = () => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const targetDate = new Date("2024-12-31T23:59:59"); // กำหนดวันที่สิ้นสุด
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00");
      } else {
        const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0");
        const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, "0");
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer); // ล้าง Timer เมื่อ component ถูก unmount
  }, []);

  return (
    <div className="beta-banner">
      <span>Open Beta</span>
      <span className="countdown">{timeLeft || "Loading..."}</span>
    </div>
  );
};

export default BetaBanner;
