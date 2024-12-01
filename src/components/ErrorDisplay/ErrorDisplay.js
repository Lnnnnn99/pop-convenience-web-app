import React from "react";
import './ErrorDisplay.css';

const ErrorDisplay = ({ message }) => {
  return <div style={{ color: "red" }}>Error: {message}</div>;
};

export default ErrorDisplay;
