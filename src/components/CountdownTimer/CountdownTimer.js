import React, { useState, useEffect } from "react";
import "./CountdownTimer.css";

const CountdownTimer = ({ endTime, message }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Beta Closed");
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [endTime]);

  return (
    <div className="countdown-timer">
      <p className="countdown-message">{message}</p>
      <p className="countdown-time">{timeLeft}</p>
    </div>
  );
};

export default CountdownTimer;
