import React, { useState, useEffect } from "react";

import './UpgradeInfo.css';

const sheetId = "1_RkKvX9ZSf6JFV06xVVhe74H6CIPdAzP";
const sheetName = "Sheet1";

const UpgradeInfo = ({ metaData, gemsData, setIsLoading, setError }) => {
  const [gem, setGem] = useState({
    'gemStar': 5,
    'gemColor': 'red'
  })

  const [gemDetails, setGemDetails] = useState([])

  useEffect(() => {
    const fetchGemDetails = () => {
      setGemDetails(
        gemsData[gem.gemStar].map((v) => ({"level": v.level, "exp": v[gem.gemColor], "belly": v[gem.gemColor] * metaData.exp_per_belly}))
      )
    }

    fetchGemDetails()
  }, [gem]);

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
        <div className="frame-content">
          <div className="frame-body body-info">
            <table class="info-table">
              <thead>
                <tr>
                  <th className="align-center">Level</th>
                  <th className="align-center">EXP</th>
                  <th className="align-center">Belly</th>
                </tr>
              </thead>
              <tbody>
                {/* {
                  gemDetails.map((detail, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="align-center">{detail.level}</td>
                      <td className="align-right">{numberWithCommas(parseInt(detail.exp))}</td>
                      <td className="align-right">{numberWithCommas(Math.floor(parseInt(detail.exp) * parseFloat(metaData.exp_per_belly)))}</td>
                    </tr>
                  ))
                } */}
                {
                  gemDetails.map((detail, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="align-center">{detail.level}</td>
                      <td className="align-right">
                        <div className="info-digit">
                          {
                            detail.exp ? (
                              numberWithCommas(Math.floor(detail.exp)).toString().split('').map(String).map((digit) => (
                                <div className="digit">
                                  <div>
                                    {digit}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="digit">
                                <p>
                                  -
                                </p>
                              </div>
                            )
                          }
                        </div>
                      </td>
                      <td className="align-right">
                      <div className="info-digit">
                          {
                            detail.exp ? (
                              numberWithCommas(Math.floor(parseInt(detail.exp) * parseFloat(metaData.exp_per_belly))).toString().split('').map(String).map((digit) => (
                                <div className="digit">
                                  <div>
                                    {digit}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="digit">
                                <p>
                                  -
                                </p>
                              </div>
                            )
                          }
                        </div>
                      </td>
                      {/* <td className="align-right">{numberWithCommas(Math.floor(parseInt(detail.exp) * parseFloat(metaData.exp_per_belly)))}</td> */}
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeInfo;
