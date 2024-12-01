import React from "react";
import './Footer.css';

const Footer = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <div className="footer">
      {
        Object.values(tabs).map((tab) => (
          <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "#ccc" : "#fff",
                padding: "10px",
                margin: "5px",
              }}
            >
              {tab.label}
            </button>
        ))
      }
    </div>
  );
};

export default Footer;
