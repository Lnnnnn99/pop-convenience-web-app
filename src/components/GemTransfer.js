import React, { useState } from "react";

const GemTransfer = () => {
  const [gemAmount, setGemAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  const handleGemChange = (e) => {
    const amount = parseFloat(e.target.value);
    setGemAmount(amount);
    setConvertedAmount(amount * 0.8); // ตัวอย่างอัตราการแปลง 80%
  };

  return (
    <div>
      <h2>Gem Transfer</h2>
      <label>
        Enter Gems to Transfer:
        <input
          type="number"
          value={gemAmount}
          onChange={handleGemChange}
          min="0"
        />
      </label>
      <p>Converted Gems: {convertedAmount.toFixed(2)}</p>
    </div>
  );
};

export default GemTransfer;
