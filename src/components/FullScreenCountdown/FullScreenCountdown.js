import React, { useState, useEffect } from "react";
import "./FullScreenCountdown.css";

const FullScreenCountdown = ({ isBetaActiveAdmin, isBetaActive, openBetaStarted, startTime, endTime, message }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isBetaClosed, setIsBetaClosed] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now < start) {
        // ก่อนเวลาเริ่ม Beta
        const diff = start - now;
        updateCountdown(diff);
      } else if (now >= start) {
        if(isBetaActiveAdmin === 'open'){
          // Beta กำลังเปิด
          openBetaStarted();
        }else{
          // setIsBetaClosed(true)
          setTimeLeft("Coming soon")
        }
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
  }, [startTime, endTime]);

  return (
    <div className="full-screen-countdown">
      <div className="countdown-content">
        {
          isBetaActiveAdmin === "close" && (
            <h1 className="countdown-message">Open Beta Closed</h1>
          )
        }
        {
          isBetaActiveAdmin === "opening" && (
            <>
              <h1 className="countdown-message">{message}</h1>
              <p className="countdown-time">{timeLeft}</p>
            </>
          )
        }

        {/* {!isBetaActiveAdmin ? (
          <h1 className="countdown-message">Open Beta Closed</h1>
        ) : (
          <>
            <h1 className="countdown-message">{message}</h1>
            <p className="countdown-time">{timeLeft}</p>
          </>
        )} */}
      </div>
    </div>
  );
};

export default FullScreenCountdown;
