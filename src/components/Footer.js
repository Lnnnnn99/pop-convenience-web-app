import React from "react";

const Footer = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <div>
      {
        Object.values(tabs).map((tab) => (
          <button>
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
          </button>
        ))
      }
    </div>
  );
};

export default Footer;
