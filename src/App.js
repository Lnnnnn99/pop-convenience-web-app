import React, { useState, useEffect } from "react";

import Footer from "./components/Footer";
import UpgradeInfo from "./components/UpgradeInfo"
import UpgradeCalculator from "./components/UpgradeCalculator"
import GemTransfer from "./components/GemTransfer"

import { readExcel } from "./utils/readExcel"

const tabs = {
  TAB01: {id: 'upgrade_info', label: 'Upgrade info'},
  TAB02: {id: 'upgrade_calculator', label: 'Upgrade calculator'},
  TAB03: {id: 'gem_tranfer', label: 'Gem tranfer'},
}

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(tabs.TAB01.id)

  // เรียกฟังก์ชัน fetchExcelData เมื่อคอมโพเนนต์ถูกเรนเดอร์
  useEffect(() => {
    // ฟังก์ชันสำหรับอ่านไฟล์ Excel
    const fetchExcelData = async () => {
      try{
        const jsonData = await readExcel("/data/sample.xlsx"); // เพิ่ม await
        setData(jsonData);
      }catch(err){
        setError(err); // เก็บข้อผิดพลาดใน State
        console.error("Error loading Excel data:", err);
      }
    };

    fetchExcelData();
  }, []);

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  return (
    <>
      {tab === tabs.TAB01.id && <UpgradeInfo data={data} />}
      {tab === tabs.TAB02.id && <UpgradeCalculator />}
      {tab === tabs.TAB03.id && <GemTransfer />}

      <Footer tabs={tabs} activeTab={tab} onChangeTab={handleTabChange}/>
    </>
  );
}

export default App;
