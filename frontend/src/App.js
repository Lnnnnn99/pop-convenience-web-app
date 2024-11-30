import React, { useState } from "react";

function App() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch("/api/excel?sheet=Sheet1");
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Excel Data Viewer</h1>
      <button onClick={loadData}>Load Data</button>
      <ul>
        {data.map((row, index) => (
          <li key={index}>{JSON.stringify(row)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
