import React, { useState, useEffect } from "react";

import Footer from "./components/Footer/Footer";
import Loading from "./components/Loading/Loading";
import ErrorDisplay from "./components/ErrorDisplay/ErrorDisplay";
import UpgradeInfo from "./components/UpgradeInfo/UpgradeInfo"
import UpgradeCalculator from "./components/UpgradeCalculator/UpgradeCalculator"
import GemTransfer from "./components/GemTransfer/GemTransfer"
import BetaBanner from "./components/BetaBanner/BetaBanner";
import FullScreenCountdown from "./components/FullScreenCountdown/FullScreenCountdown";

import { readExcelAsList, readExcelAsJson, generateGoogleSheetCSVUrl } from "./utils/readExcel"
import { checkTimeDifference } from "./utils/timeUtils";

import './App.css';

const sheetId = "1wE5fiu6FZAQvd9y3GLDb9RRTLOAvtkLHKwxxPtV7Whc";

const tabs = {
  TAB01: {id: 'upgrade_info', label: 'Upgrade info'},
  TAB02: {id: 'upgrade_calculator', label: 'Upgrade calculator'},
  TAB03: {id: 'gem_tranfer', label: 'Gem tranfer'},
  TAB04: {id: 'level_calculate', label: 'Level calculator'},
}

function App() {
  
  const [tab, setTab] = useState(tabs.TAB01.id);
  const [isLoading, setIsLoading] = useState(true); // สถานะ Loading
  const [error, setError] = useState(null); // สถานะ Error
  
  const [metaData, setMetaData] = useState({})
  const [gemsData, setGemsData] = useState({});

  const [isBetaActive, setIsBetaActive] = useState(false);
  const [enabledTabs, setEnabledTabs] = useState([]);

  const [isTimeValid, setIsTimeValid] = useState(true); // สถานะเวลาที่ตรงกัน

  useEffect(() => {
    const readMetaData = async () => {
      try{
        setIsLoading(true)
        
        const [gem_5, gem_6, meta_data] = await Promise.all([
          readExcelAsList(generateGoogleSheetCSVUrl(sheetId, `5 star`)),
          readExcelAsList(generateGoogleSheetCSVUrl(sheetId, `6 star`)),
          readExcelAsJson(generateGoogleSheetCSVUrl(sheetId, `meta data`)),
        ]);
  
        setGemsData((prev) => ({
          ...prev,
          5: gem_5,
          6: gem_6,
        }));
        
        setMetaData(meta_data)
        
        // // ตั้งค่าการเปิด Beta
        // const isValid = await checkTimeDifference()
        // if(isValid){
        //   const now = new Date();
        //   const betaStart = new Date(meta_data.open_beta_start);
        //   const betaEnd = new Date(meta_data.open_beta_end);
        //   setIsBetaActive(now >= betaStart && now <= betaEnd);
        // }else{
        //   setIsTimeValid(isValid)
        // }
        
        const now = new Date();
        const betaStart = new Date(meta_data.open_beta_start);
        const betaEnd = new Date(meta_data.open_beta_end);
        setIsBetaActive(now >= betaStart && now <= betaEnd);
          
        // ตั้งค่าการใช้งาน Tabs
        const enabledTabsFromMeta = meta_data.tabs_enabled || [];
        setEnabledTabs(enabledTabsFromMeta);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }catch(err){
        setError(err);
      }finally{
        setIsLoading(false)
      }
    } 

    const validateTimeRealTime = async () => {
      const interval = setInterval(async () => {
        const isValid = await checkTimeDifference();
        setIsTimeValid(isValid);
      }, 60000); // ตรวจสอบทุก 5 วินาที

      return () => clearInterval(interval); // ล้าง Interval เมื่อ Component ถูก unmount
    };

    readMetaData();
    // validateTimeRealTime();
  }, [])

  const fetchMetaData = async () => {
    try{      
      const [meta_data] = await Promise.all([
        readExcelAsJson(generateGoogleSheetCSVUrl(sheetId, `meta data`)),
      ]);
      
      setMetaData(meta_data)

      // ตั้งค่าการเปิด Beta
      const now = new Date();
      const betaStart = new Date(meta_data.open_beta_start);
      const betaEnd = new Date(meta_data.open_beta_end);
      setIsBetaActive(now >= betaStart && now <= betaEnd);

      // ตั้งค่าการใช้งาน Tabs
      const enabledTabsFromMeta = meta_data.tabs_enabled || [];
      setEnabledTabs(enabledTabsFromMeta);
    }catch(err){
      setError(err);
    }
  } 

  const setTabOnClick = async (tab) => {
    setTab(tab)
    await fetchMetaData()
  }

  const openBetaStarted = () => {
    setIsBetaActive(true);
  };

  const closeBeta = () => {
    setIsBetaActive(false);
  };

  if (!isTimeValid) {
    return (
      <ErrorDisplay 
        message="ชิบหายละกูโดนเหลี่ยมละไง"   
      />
    );
  }

  return (
    <div className="app-container">
      {/* แสดงสถานะ Loading หรือ Error */}
      {isLoading && <Loading isLoading={isLoading}/>}
      {error && <ErrorDisplay message={error} />}

      {!isLoading && !error && (
        <BetaBanner
          openBetaStart={metaData.open_beta_start}
          openBetaEnd={metaData.open_beta_end}
          activeOpenBeta={openBetaStarted}
          closeBeta={closeBeta}
        />
      )}

      {!isLoading && !error && (
          isBetaActive ? (
            <>
              <div className="content">
                  {enabledTabs.includes(tab) && tab === tabs.TAB01.id && (
                    <UpgradeInfo metaData={metaData} gemsData={gemsData} setIsLoading={setIsLoading} setError={setError} />
                  )}
                  {enabledTabs.includes(tab) && tab === tabs.TAB02.id && (
                    <UpgradeCalculator metaData={metaData} gemsData={gemsData} setIsLoading={setIsLoading} setError={setError} />
                  )}
                  {enabledTabs.includes(tab) && tab === tabs.TAB03.id && (
                    <GemTransfer setIsLoading={setIsLoading} setError={setError} />
                  )}
                  {!enabledTabs.includes(tab) && <ErrorDisplay message="กรุณาสมัคร Premium plus เพื่อเปิดใช้ฟังก์ชัน." fullScreen={false} />}
              </div>

              <Footer tabs={tabs} activeTab={tab} onChangeTab={(tab) => setTabOnClick(tab)}/>
            </>
          ) : (
            <FullScreenCountdown
              activeOpenBeta={openBetaStarted}
              closeBeta={closeBeta}
              startTime={metaData.open_beta_start}
              endTime={metaData.open_beta_end}
              message="Open Beta Starts In:"
            />
          )
        )
      }
    </div>
  );
}

export default App;
