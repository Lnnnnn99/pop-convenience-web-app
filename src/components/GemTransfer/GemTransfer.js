import React, { useEffect, useState } from "react";

import './GemTransfer.css';

const GemTransfer = ({ metaData, gemsData, gemsPower, setIsLoading, setError }) => {

  const [fromGem, setFromGem] = useState({
    'gemStar': 5,
    'gemColor': 'red'
  })

  const [toGem, setToGem] = useState({
    'gemStar': 5,
    'gemColor': 'red'
  })

  const [detail, setDetail] = useState({
    'currentLevel': 1,
    'currentExp': 0,
    'currentPower': 0,
    'installed': 0,
  })

  const [result, setResult] = useState({
    'expObtained': 0,
    'newLevel': 0,
    'expRemaining': 0,
    'newPower': 0
  })


  const detailOnChange = (e) => {
    const { id, type, value, checked } = e.target;

    setDetail({
      ...detail, 
      [id]: type === "checkbox" ? (checked ? 1 : 0) : parseInt(value, 10),
    })
  }

  useEffect(() => {
    calculateResult()
  }, [fromGem, toGem, detail])

  const calculateResult = () => {
    const _fromGem = {
      'star': fromGem.gemStar,
      'color': fromGem.gemColor,
    }
    const _toGem = {
      'star': toGem.gemStar,
      'color': toGem.gemColor,
    }
    const _currentLevel = detail.currentLevel
    const _currentExp = detail.currentExp
    const _installed = detail.installed
    const _currentPower = detail.currentPower

    // Calculate EXP Obtained
    const _expObtained = gemsData[_fromGem.star]
      .filter((v) => v.level < _currentLevel)
      .reduce((a, c) => a + c[_fromGem.color], 0) + (_currentExp || 0)


    // Calulate new level
    const _newLevel = gemsData[_toGem.star]
      .filter((v) => v[_toGem.color] !== 0)
      .reduce((a, c) => {
        if(c[_toGem.color] <= a.remainingExp){
          a.remainingExp -= c[_toGem.color]
          a.level += 1
        }
        return a
      }, {level: 1, remainingExp: _expObtained})


    console.log(gemsPower)

    // Calculate Power
    let _basePower = _currentPower
    let _newPower = 0
    let _oldPower = 0

    const gemPowerOld = gemsPower.find((g) => g.star === fromGem.gemStar);
    if (gemPowerOld) {
      const multiplier = gemPowerOld[fromGem.gemColor];
      if (gemPowerOld.type === "value") {
        _oldPower = _newLevel.level * multiplier;
      } else if (gemPowerOld.type === "percentage") {
        _oldPower = _basePower * (_newLevel.level * multiplier / 100);
      }
    }

    if (_installed) {
      _basePower -= _oldPower;
    }

    console.log("Base Power after removing old gem power:", _basePower);

    const gemPowerNew = gemsPower.find((g) => g.star === toGem.gemStar);
    if (gemPowerNew) {
      const multiplier = gemPowerNew[toGem.gemColor];
      if (gemPowerNew.type === "value") {
        _newPower = _basePower + (_newLevel.level * multiplier);
      } else if (gemPowerNew.type === "percentage") {
        _newPower = _basePower + (_basePower * (_newLevel.level * multiplier / 100));
      }
    }


    setResult({
      ...result,
      'expObtained': _expObtained,
      'newLevel': _newLevel.level,
      'expRemaining': _newLevel.remainingExp,
      'newPower': _newPower
    })
  }

  return (
    <div className="frame-container">
      
      
      <div className="frame-row">
        <div className="frame-col">
          <div className="frame-content">
            <div className="frame-header menu-buttons">
              {
                metaData.stars && metaData.stars.map((star) => (
                  <div 
                    className={`menu-button ${fromGem.gemStar === star.value ? 'active' : ''}`} 
                    key={star.id}
                    onClick={() => setFromGem({...fromGem, gemStar: star.value})}
                  ><p>{star.label}</p></div>
                ))
              }
            </div>
            <div className="frame-body body-images">
              {
                metaData.colors && metaData.colors.map((color) => (
                  <div 
                    key={color}
                    className={`body-image ${fromGem.gemColor === color ? 'active' : ''}`}
                    onClick={() => setFromGem({...fromGem, gemColor: color})}
                    >
                    <img src={"/images/gems/" + fromGem.gemStar +  "_" + color + ".png"} alt={color}/>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="frame-col">
          <div className="frame-content">
            <div className="frame-header menu-buttons">
              {
                metaData.stars && metaData.stars.map((star) => (
                  <div 
                    className={`menu-button ${toGem.gemStar === star.value ? 'active' : ''}`} 
                    key={star.id}
                    onClick={() => setToGem({...toGem, gemStar: star.value})}
                  ><p>{star.label}</p></div>
                ))
              }
            </div>
            <div className="frame-body body-images">
              {
                metaData.colors && metaData.colors.map((color) => (
                  <div 
                    key={color}
                    className={`body-image ${toGem.gemColor === color ? 'active' : ''}`}
                    onClick={() => setToGem({...toGem, gemColor: color})}
                    >
                    <img src={"/images/gems/" + toGem.gemStar +  "_" + color + ".png"} alt={color}/>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <div className="frame-row">
        <div className="frame-col">
          <div className="frame-content">
            <div className="frame-header header-title">
              Detail
            </div>
            <div className="frame-body body-form">
              <div className="form">
                <div className="input-group">
                  <label htmlFor="currentLevel">เลเวลปัจจุบัน</label>
                  <input 
                    id="currentLevel"
                    type="number"
                    value={detail.currentLevel}
                    onChange={detailOnChange} 
                    />
                </div>
                <div className="input-group">
                  <label htmlFor="currentExp">EXP ปัจจุบัน</label>
                  <input 
                    id="currentExp"
                    type="number"
                    value={detail.currentExp}
                    onChange={detailOnChange} 
                    />
                </div>
                <div className="input-group">
                  <label htmlFor="installed">ใส่ gem อยู่</label>
                  <input 
                    id="installed"
                    type="checkbox"
                    checked={detail.installed === 1}
                    onChange={detailOnChange} 
                    />
                </div>
                <div className="input-group">
                  <label htmlFor="currentPower">พลังเก่า</label>
                  <input 
                    id="currentPower"
                    type="number"
                    value={detail.currentPower}
                    onChange={detailOnChange} 
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="frame-col">
          <div className="frame-content">
            <div className="frame-header header-title">
              Result
            </div>
            <div className="frame-body body-info">
              <p><strong>Exp ที่ได้:</strong> <span className="highlight">{result.expObtained}</span></p>
              <p><strong>level ใหม่:</strong> <span className="highlight">{result.newLevel}</span></p>
              <p><strong>EXP ที่เหลือ:</strong> <span className="highlight">{result.expRemaining}</span></p>
              <p><strong>พลังใหม่ :</strong> <span className="highlight">{result.newPower}</span></p>
            </div>            
          </div>
        </div>
      </div>

    </div>
  );
};

export default GemTransfer;
