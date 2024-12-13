import React, { useState, useEffect } from "react";
import "./BetaBanner.css";

import { checkTimeDifference } from "../../utils/timeUtils"; // เพิ่มการนำเข้า

const BetaBanner = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("active"); // "before", "active", "closed"

  return (
    <div className="beta-banner">
      <span>Test Beta</span>
    </div>
  );
};

export default BetaBanner;
