import React, { useState, useEffect } from "react";

import Footer from "./components/Footer/Footer";
import Loading from "./components/Loading/Loading";
import ErrorDisplay from "./components/ErrorDisplay/ErrorDisplay";
import UpgradeInfo from "./components/UpgradeInfo/UpgradeInfo"
import UpgradeCalculator from "./components/UpgradeCalculator/UpgradeCalculator"
import GemTransfer from "./components/GemTransfer/GemTransfer"
import BetaBanner from "./components/BetaBanner/BetaBanner";

import { readExcelAsList, readExcelAsJson } from "./utils/readExcel"

import './App.css';

const tabs = {
  TAB01: {id: 'upgrade_info', label: 'Upgrade info'},
  TAB02: {id: 'upgrade_calculator', label: 'Upgrade calculator'},
  TAB03: {id: 'gem_tranfer', label: 'Gem tranfer'},
}

function App() {
  
  const [tab, setTab] = useState(tabs.TAB02.id);
  const [isLoading, setIsLoading] = useState(true); // สถานะ Loading
  const [error, setError] = useState(null); // สถานะ Error
  
  const [metaData, setMetaData] = useState({})
  const [gemsData, setGemsData] = useState({});

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

  useEffect(() => {
    const readMetaData = async () => {
      try{
        setIsLoading(true)
        
        const [gem_5, gem_6, meta_data] = await Promise.all([
          readExcelAsList("/datas/gems.xlsx", `5 star`),
          readExcelAsList("/datas/gems.xlsx", `6 star`),
          readExcelAsJson("/datas/gems.xlsx", `meta data`),
        ]);
  
        setGemsData((prev) => ({
          ...prev,
          5: gem_5,
          6: gem_6,
        }));
        
        setMetaData(meta_data)
      }catch(err){
        setError(err);
      }finally{
        setIsLoading(false)
      }
    } 

    readMetaData();
  }, [])


  return (
    <div className="app-container">
      <BetaBanner/>
      {/* แสดงสถานะ Loading หรือ Error */}
      {isLoading && <Loading />}
      {error && <ErrorDisplay message={error} />}

      { !isLoading && !error && (
          <>
            <div className="content">
              {tab === tabs.TAB01.id && <UpgradeInfo setIsLoading={(isLoading) => setIsLoading(isLoading)} setError={(error) => setError(error)}/>}
              {tab === tabs.TAB02.id && <UpgradeCalculator metaData={metaData} gemsData={gemsData} setIsLoading={(isLoading) => setIsLoading(isLoading)} setError={(error) => setError(error)}/>}
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
