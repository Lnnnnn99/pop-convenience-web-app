import React, { useState, useEffect } from "react";
import "./BetaBanner.css";

const BetaBanner = ({ openBetaStart, openBetaEnd, activeOpenBeta, closeBeta }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("before"); // "before", "active", "closed"

  useEffect(() => {
    const calculateStatus = () => {
      const now = new Date();
      const start = new Date(openBetaStart);
      const end = new Date(openBetaEnd);

      if (now < start) {
        setStatus("before");
        updateCountdown(start - now);
      } else if (now >= start && now <= end) {
        setStatus("active");
        activeOpenBeta();
        updateCountdown(end - now);
      } else {
        setStatus("closed");
        closeBeta();
      }
    };

    const updateCountdown = (difference) => {
      if (difference <= 0) {
        setTimeLeft("00:00:00");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0");
        const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, "0");
        setTimeLeft(days > 0 ? `${days}d ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`);
      }
    };

    const timer = setInterval(calculateStatus, 1000);
    calculateStatus(); // Run immediately on mount

    return () => clearInterval(timer); // Cleanup on unmount
  }, [openBetaStart, openBetaEnd, activeOpenBeta, closeBeta]);

  return (
    <div className="beta-banner">
      {status === "before" && (
        <>
          <span>Open Beta Starts In:</span>
          <span className="countdown">{timeLeft || "Loading..."}</span>
        </>
      )}
      {status === "active" && (
        <>
          <span>Open Beta</span>
          <span className="countdown">{timeLeft}</span>
        </>
      )}
      {status === "closed" && <span>Open Beta Closed</span>}
    </div>
  );
};

export default BetaBanner;
