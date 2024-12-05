import React, { useEffect, useState } from "react";

import './UpgradeCalculator.css';

const UpgradeCalculator = ({ metaData, gemsData, setIsLoading, setError }) => {

  const [gem, setGem] = useState({
    'gemStar': 5,
    'gemColor': 'red'
  })

  const [detail, setDetail] = useState({
    'type': 'requiredLevel',
    'budgetUpgrade': {
      'budget': 0,
      'currentLevel': 0,
      'currentExp': 0
    },
    'requiredLevel':{
      'neededLevel': 1,
      'currentLevel': 1,
      'currentExp': 0,
    }
  })

  const [result, setResult] = useState({
    'type': 'requiredLevel',
    'levelObtained': 0,
    'expObtained': 0,
    'expRemaining': 0,
    'neededBudget': 0,
    'neededExp': 0
  })

  useEffect(() => {
    calculateResult()
  }, [gem, detail])

  const detailOnChange = (e) => {
    const {id, value} = e.target
    const type = detail.type

    setDetail({
      ...detail, 
      [type]: {
        ...detail[type], 
        [id]: parseInt(value)
      }
    })
  }

  const calculateResult = () => {
    const _star = gem.gemStar
    const _color = gem.gemColor
    const _type = detail.type
    const _currentLevel = detail[_type].currentLevel
    const _currentExp = detail[_type].currentExp
    const _budget = parseFloat(detail[_type]?.budget) * 1000000
    const _neededLevel = detail[_type]?.neededLevel || 1

    const _gemData = gemsData[_star]

    // Level
    const _totalExpByLevel = _gemData
      .filter((v) => v.level >= _currentLevel && v.level < _neededLevel)
      .reduce((a, c) => a + parseFloat(c[_color]), 0)
    
    let _neededExp = _totalExpByLevel
    const _neededBudget = _neededExp * metaData.exp_per_belly
    // 

    // Budget
    const _totalExpByBudget = _budget * metaData.belly_per_exp

    const _expObtained = _totalExpByBudget  + _currentExp 
    let _levelObtained = _gemData
      .filter((v) => v.level >= _currentLevel)
      .reduce((a, c) => {
        if(a.remainingExp >= c[_color] && c[_color] != 0){
          a.level = c.level
          a.remainingExp -= c[_color]
        }
        return a
      }, {level: _currentLevel, remainingExp: _expObtained})
    
    if(_neededLevel > 30 && _star == 5){
      _neededExp = _neededExp + " ใจเย็นนะพี่ เอาแค่ level 30 ไปก่อน"
    }
    if(_neededLevel > 20 && _star == 6 && !['red', 'orange', 'purple', 'green'].includes(_color)){
      _neededExp = _neededExp + " ใจเย็นนะพี่ เอาแค่ level 20 ไปก่อน"
    }else if(_neededLevel > 40 && _star == 6 && ['red', 'orange', 'purple', 'green'].includes(_color)){
      _neededExp = _neededExp + " ใจเย็นนะพี่ เอาแค่ level 40 ไปก่อน"
    }
    
    if(_budget < 0){
      _levelObtained.level = _levelObtained.level + " อะไรว่ะเนี่ยยย มันลบไม่ได้โว้ยยย"
    }

    if(_levelObtained.remainingExp > 100000000){
      _levelObtained.level = _levelObtained.level + " พอเถอะพี่ ผมเหนื่อย"
    }else
    if(_levelObtained.remainingExp > 1000000){
      _levelObtained.level = _levelObtained.level + " ละพี่เขากะเอาสุดไง"
    }else
    if(_levelObtained.remainingExp > 100000){
      _levelObtained.level = _levelObtained.level + " พี่ก็รวยเกินน เอาแค่นี้ไปก่อนนะ"
    }

    setResult({
      ...result,
      type: _type,
      neededBudget: _neededBudget,
      neededExp: _neededExp,
      levelObtained: _levelObtained.level,
      expObtained: _expObtained,
      expRemaining: _levelObtained.remainingExp,
    })
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="frame-container">
      <div className="frame-row">
        <div className="frame-content">
          <div className="frame-header menu-buttons">
            {
               metaData.stars && metaData.stars.map((star) => (
                <div 
                  className={`menu-button ${gem.gemStar === star.value ? 'active' : ''}`} 
                  key={star.id}
                  onClick={() => setGem({...gem, gemStar: star.value})}
                ><p>{star.label}</p></div>
              ))
            }
          </div>
          <div className="frame-body body-images">
            {
              metaData.colors && metaData.colors.map((color) => (
                <div 
                  key={color}
                  className={`body-image ${gem.gemColor === color ? 'active' : ''}`}
                  onClick={() => setGem({...gem, gemColor: color})}
                  >
                  <img src={"/images/gems/" + gem.gemStar +  "_" + color + ".png"} alt={color}/>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="frame-row">
        <div className="frame-col">
          <div className="frame-content">
            <div className="frame-header menu-buttons">
              <div 
                className={`menu-button ${detail.type === 'requiredLevel' ? 'active' : ''}`}
                onClick={() => setDetail({...detail, type: 'requiredLevel'})}
                ><p>อัพตามเลเวล</p></div>
              <div 
                className={`menu-button ${detail.type === 'budgetUpgrade' ? 'active' : ''}`}
                onClick={() => setDetail({...detail, type: 'budgetUpgrade'})}
                ><p>อัพตามจำนวนเงิน</p></div>
            </div>
            <div className="frame-body body-form">
              {detail.type === 'requiredLevel' && (
                <div className="form">
                  <div className="input-group">
                    <label htmlFor="currentLevel">เลเวลปัจจุบัน</label>
                    <input 
                      id="currentLevel"
                      type="number"
                      value={detail.requiredLevel.currentLevel}
                      onChange={detailOnChange} 
                      />
                  </div>
                  <div className="input-group">
                    <label htmlFor="currentExp">EXP ปัจจุบัน</label>
                    <input 
                      id="currentExp" 
                      type="number"
                      value={detail.requiredLevel.currentExp}
                      onChange={detailOnChange} 
                      />
                  </div>
                  <div className="input-group">
                    <label htmlFor="neededLevel">เลเวลที่ต้องการ</label>
                    <input 
                      id="neededLevel" 
                      type="number"
                      value={detail.requiredLevel.neededLevel}
                      onChange={detailOnChange} 
                      />
                  </div>
                </div>
              )}
              {detail.type === 'budgetUpgrade' && (
                <div className="form">
                  <div className="input-group">
                    <label htmlFor="currentLevel">เลเวลปัจจุบัน</label>
                    <input 
                      id="currentLevel" 
                      type="number"
                      value={detail.budgetUpgrade.currentLevel}
                      onChange={detailOnChange} 
                      />
                  </div>
                  <div className="input-group">
                    <label htmlFor="currentExp">EXP ปัจจุบัน</label>
                    <input 
                      id="currentExp" 
                      type="number" 
                      value={detail.budgetUpgrade.currentExp}
                      onChange={detailOnChange} 
                      />
                  </div>
                  <div className="input-group">
                    <label htmlFor="budget">เบรี่ที่มี (ล้าน)</label>
                    <input 
                      id="budget" 
                      type="number" 
                      value={detail.budgetUpgrade.budget}
                      onChange={detailOnChange} 
                      />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="frame-col">
          <div className="frame-content">
            <div className="frame-header header-title">
              Result
            </div>
            <div className="frame-body body-info">
              {
                result.type === 'budgetUpgrade' && (
                  <>
                    <p><strong>EXP ที่ได้รับ:</strong> <span className="highlight">{numberWithCommas(Math.floor(result.expObtained))}</span></p>
                    <p><strong>อัพได้ถีงเลเวล :</strong> <span className="highlight">{result.levelObtained}</span></p>
                    <p><strong>EXP ที่เหลือ:</strong> <span className="highlight">{numberWithCommas(Math.floor(result.expRemaining))}</span></p>
                  </> 
                )
              }
              {
                result.type === 'requiredLevel' && (
                  <>
                    <p><strong>จำนวนเบรี่ที่ต้องใช้:</strong> <span className="highlight">{numberWithCommas(Math.floor(result.neededBudget))}</span></p>
                    <p><strong>จำนวน EXP ที่ต้องใช้:</strong> <span className="highlight">{numberWithCommas(result.neededExp)}</span></p>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeCalculator;
