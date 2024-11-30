import React, { useState } from "react";

const UpgradeCalculator = () => {
  const [level, setLevel] = useState(1);
  const [requiredExp, setRequiredExp] = useState(0);

  const calculateExp = (level) => {
    // ตัวอย่างการคำนวณ EXP
    return level * 100; // ปรับสูตรตามต้องการ
  };

  const handleLevelChange = (e) => {
    const newLevel = parseInt(e.target.value, 10);
    setLevel(newLevel);
    setRequiredExp(calculateExp(newLevel));
  };

  return (
    <div>
      <h2>Upgrade Calculator</h2>
      <label>
        Enter Level:
        <input
          type="number"
          value={level}
          onChange={handleLevelChange}
          min="1"
        />
      </label>
      <p>Required EXP: {requiredExp}</p>
    </div>
  );
};

export default UpgradeCalculator;
