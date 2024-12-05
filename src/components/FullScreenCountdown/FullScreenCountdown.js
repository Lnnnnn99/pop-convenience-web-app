import React, { useState, useEffect } from "react";
import "./FullScreenCountdown.css";

const FullScreenCountdown = ({ activeOpenBeta, closeBeta, startTime, endTime, message }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isBetaClosed, setIsBetaClosed] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now < start) {
        // ก่อนเวลาเริ่ม Beta
        const diff = start - now;
        updateCountdown(diff);
      } else if (now >= start && now <= end) {
        // Beta กำลังเปิด
        activeOpenBeta();
        const diff = end - now;
        updateCountdown(diff);
      } else {
        // Beta หมดเวลา
        setIsBetaClosed(true);
        setTimeLeft("Open Beta Closed");
        closeBeta(); // เรียก Callback เพื่อปิด Beta
      }
    };

    const updateCountdown = (diff) => {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [startTime, endTime, activeOpenBeta, closeBeta]);

  return (
    <div className="full-screen-countdown">
      <div className="countdown-content">
        {isBetaClosed ? (
          <h1 className="countdown-message">Open Beta Closed</h1>
        ) : (
          <>
            <h1 className="countdown-message">{message}</h1>
            <p className="countdown-time">{timeLeft}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FullScreenCountdown;
