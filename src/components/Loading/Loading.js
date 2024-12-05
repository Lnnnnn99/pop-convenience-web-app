import React, { useEffect, useState } from "react";
import "./Loading.css";

const Loading = ({ isLoading, children }) => {
  const [showLoading, setShowLoading] = useState(isLoading);

  useEffect(() => {
    let timeout;
    if (!isLoading) {
      // หน่วงเวลา 0.5 วินาที ก่อนซ่อน Loading
      timeout = setTimeout(() => setShowLoading(false), 500);
    } else {
      setShowLoading(true); // แสดง Loading ทันทีเมื่อ isLoading เป็น true
    }

    return () => clearTimeout(timeout); // ล้าง timeout เมื่อ Component ถูก unmount
  }, [isLoading]);

  if (!showLoading) {
    return null;
  }

  return (
    <div className="loading-container">
      <div className="loading-content">
        <h1 className="loading-message">Loading...</h1>
      </div>
    </div>
  );
};

export default Loading;
