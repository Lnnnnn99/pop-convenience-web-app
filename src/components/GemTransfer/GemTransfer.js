import React, { useEffect, useState } from "react";

import { readExcelAsList, readExcelAsJson } from "../../utils/readExcel"

import './GemTransfer.css';

const gems = {
  5: ['yellow', 'sky', 'blue', 'green', 'red', 'orange', 'purple'],
  6: ['yellow', 'sky', 'blue', 'green', 'red', 'orange', 'purple'],
}

const GemTransfer = ({ setIsLoading, setError }) => {
  const [gemAmount, setGemAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  const [oldStar, setOldStar] = useState(5)
  const [newStar, setNewStar] = useState(5)

  const [oldSeletedStar, setOldSelectedStar] = useState([])
  const [newSeletedStar, setNewSelectedStar] = useState([])

  const [oldSeletedColor, setOldSelectedColor] = useState('yellow')
  const [newSeletedColor, setNewSelectedColor] = useState('yellow')

  const [oldLevel, setOldLevel] = useState(0)
  const [newLevel, setNewLevel] = useState(0)

  const [remain, setRemain] = useState(0)
  
  const [currentValue, setCurrentValue] = useState(0)
  const [newValue, setNewValue] = useState(0)

  const [installed, setInstallede] = useState(true)

  useEffect(() => {
    fetchTranfering()
  }, [oldStar, oldSeletedColor, oldLevel, newStar, newSeletedColor, newLevel, installed])

  const handleGemChange = (e) => {
    const amount = parseFloat(e.target.value);
    setGemAmount(amount);
    setConvertedAmount(amount * 0.8); // ตัวอย่างอัตราการแปลง 80%
  };

  const handleOldClick = (star) => {
    setOldStar(star)
    setOldSelectedStar(gems[star])
  }

  const handleNewClick = (star) => {
    setNewStar(star)
    setNewSelectedStar(gems[star])
  }

  const fetchTranfering = async () => {
    try{
      // setIsLoading(true)

      const gemsOldInfo = await readExcelAsList("/datas/gems.xlsx", `${oldStar} star`);
      const gemsNewInfo = await readExcelAsList("/datas/gems.xlsx", `${newStar} star`);

      let oldSum = gemsOldInfo.filter((v) => parseInt(v.level) <= oldLevel).reduce((a, v) => a + (parseInt(v[oldSeletedColor]) || 0), 0)
      
      let newLevelSum = 0
      for(let v of gemsNewInfo){
        if(oldSum >= v[newSeletedColor]){
          newLevelSum += 1
          oldSum -= v[newSeletedColor]
        }else{
          break
        }
      }

      let diff = 0
      if(installed){
        if(oldStar === 5){
          if(['yellow', 'sky', 'blue'].includes(oldSeletedColor)){
            diff = parseInt(oldLevel) * 60
          }else if(oldSeletedColor === 'green'){
            diff = parseInt(oldLevel) * 300
          }else{
            diff = parseInt(oldLevel) * 80
          }
        }
      }
      
      setNewValue(calculateValue(newStar, newLevelSum, currentValue-diff))
      setRemain(oldSum)
      setNewLevel(newLevelSum)

    }catch(err){
      setError(err);
    }finally{
      setIsLoading(false)
    }
  }

  const handleValueOnChange = (e) => {
    const value = e.target.value
    setCurrentValue(value)
    let diff = 0
    if(installed){
      if(oldStar === 5){
        if(['yellow', 'sky', 'blue'].includes(oldSeletedColor)){
          diff = parseInt(oldLevel) * 60
        }else if(oldSeletedColor === 'green'){
          diff = parseInt(oldLevel) * 300
        }else{
          diff = parseInt(oldLevel) * 80
        }
      }
    }
    setNewValue(calculateValue(newStar, newLevel, value-diff))
  }

  function calculateValue(star, level, value){
    if(star === 5){

    }else if(star === 6){
      const calculate = (((1.5 * parseInt(level))/100) * value) + parseInt(value)
      return calculate
    }
  }

  return (
    <div>
      <h2>Gem Transfer</h2>
      <div className="tranfering-info">
        <div>
          <div className="buttons">
            <button
              onClick={() => handleOldClick(5)}
            >5 star</button>
            <button
              onClick={() => handleOldClick(6)}
            >6 star</button>
          </div>

          <div className="gems">
            {
              oldSeletedStar.map((c) => (
                <button key={c} 
                  onClick={() => setOldSelectedColor(c)}
                >{c}</button>
              ))
            }
          </div>
          
          <input
            type="number"
            value={oldLevel}
            onChange={(e) => setOldLevel(e.target.value)}
          />

          <h1 style={{color: oldSeletedColor}}>Star : {oldStar}, Color : {oldSeletedColor}, Level : {oldLevel}</h1>
        </div>
        <div>
          <div className="buttons">
            <button
              onClick={() => handleNewClick(5)}
            >5 star</button>
            <button
              onClick={() => handleNewClick(6)}
            >6 star</button>
          </div>

          <div className="gems">
            {
              newSeletedStar.map((c) => (
                <button key={c} 
                  onClick={() => setNewSelectedColor(c)}
                >{c}</button>
              ))
            }
          </div>

          {/* <input
            type="number"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
          /> */}

          <h1 style={{color: newSeletedColor}}>Star : {newStar}, Color : {newSeletedColor}</h1>
        </div>
      </div>

      <div className="tranfering-result">

          <div>
            Installed : <input type="checkbox" checked={installed}
              onChange={() => setInstallede(!installed)}
            />
          </div>

          <div>
            New level : {newLevel}
          </div>
          <div>
            Remain EXP : {remain}
          </div>

          <input
            type="number"
            value={currentValue}
            onChange={handleValueOnChange}
            // onChange={(e) => setCurrentValue(e.target.value)}
          />

          <div>
            New value : {newValue}
          </div>
      </div>
      {/* <label>
        Enter Gems to Transfer:
        <input
          type="number"
          value={gemAmount}
          onChange={handleGemChange}
          min="0"
        />
      </label> */}
      {/* <p>Converted Gems: {convertedAmount.toFixed(2)}</p> */}
    </div>
  );
};

export default GemTransfer;
