import React, { useState, useEffect } from "react";

import Footer from "./components/Footer/Footer";
import Loading from "./components/Loading/Loading";
import ErrorDisplay from "./components/ErrorDisplay/ErrorDisplay";
import UpgradeInfo from "./components/UpgradeInfo/UpgradeInfo"
import UpgradeCalculator from "./components/UpgradeCalculator/UpgradeCalculator"
import GemTransfer from "./components/GemTransfer/GemTransfer"

import { readExcelAsList, readExcelAsJson } from "./utils/readExcel"

import './App.css';

const tabs = {
  TAB01: {id: 'upgrade_info', label: 'Upgrade info'},
  TAB02: {id: 'upgrade_calculator', label: 'Upgrade calculator'},
  TAB03: {id: 'gem_tranfer', label: 'Gem tranfer'},
}

function App() {
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({})
  const [tab, setTab] = useState(tabs.TAB03.id);
  const [isLoading, setIsLoading] = useState(false); // สถานะ Loading
  const [error, setError] = useState(null); // สถานะ Error

  // เรียกฟังก์ชัน fetchExcelData เมื่อคอมโพเนนต์ถูกเรนเดอร์
  // useEffect(() => {
  //   setIsLoading(true)
  //   // ฟังก์ชันสำหรับอ่านไฟล์ Excel
  //   const fetchExcelData = async () => {
  //     try{
  //       const jsonData = await readExcelAsList("/datas/gems.xlsx"); // เพิ่ม await
  //       setData(jsonData);
  //       const objectData = await readExcelAsJson("/datas/gems.xlsx", 'meta data'); // เพิ่ม await
  //       setMetaData(objectData);
  //     }catch(err){
  //       setError(err); // เก็บข้อผิดพลาดใน State
  //       console.error("Error loading Excel data:", err);
  //     }finally{
  //       setIsLoading(false)
  //     }
  //   };

  //   fetchExcelData();
  // }, []);


  return (
    <div className="app-container">
      {/* แสดงสถานะ Loading หรือ Error */}
      {isLoading && <Loading />}
      {error && <ErrorDisplay message={error} />}

      { !isLoading && !error && (
          <>
            <div className="content">
              {tab === tabs.TAB01.id && <UpgradeInfo setIsLoading={(isLoading) => setIsLoading(isLoading)} setError={(error) => setError(error)}/>}
              {tab === tabs.TAB02.id && <UpgradeCalculator  setIsLoading={(isLoading) => setIsLoading(isLoading)} setError={(error) => setError(error)}/>}
              {tab === tabs.TAB03.id && <GemTransfer  setIsLoading={(isLoading) => setIsLoading(isLoading)} setError={(error) => setError(error)}/>}
            </div>

            <Footer tabs={tabs} activeTab={tab} onChangeTab={(tab) => setTab(tab)}/>
          </>
        )
      }
      
    </div>
  );
}

export default App;
