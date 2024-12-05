import React from "react";
import "./ErrorDisplay.css";

const ErrorDisplay = ({ message, fullScreen = true }) => {
  return (
    <div className={`error-display ${fullScreen ? "full-screen" : "tab-content"}`}>
      <div className="error-content">
        <h1 className="error-title">Error</h1>
        <p className="error-message">{message || "Something went wrong. Please try again later."}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
