import React, { useState, useEffect } from "react";

import { readExcelAsList, readExcelAsJson } from "../../utils/readExcel"

import './UpgradeInfo.css';

const gems = {
  5: ['yellow', 'sky', 'blue', 'green', 'red', 'orange', 'purple'],
  6: ['yellow', 'sky', 'blue', 'green', 'red', 'orange', 'purple'],
}

const UpgradeInfo = ({ setIsLoading, setError }) => {
  const [star, setStar] = useState(5)
  const [color, setColor] = useState('red')
  const [filterGem, setFilterGem] = useState([])
  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    const fetchExcelData = async () => {
      try{
        // setIsLoading(true)
    
        const jsonData = await readExcelAsList("/datas/gems.xlsx", `${star} star`);
        // setData(jsonData);
        setFilterGem(gems[star])
        setFilterData(getColumn(jsonData, color))
      }catch(err){
        setError(err);
      }finally{
        setIsLoading(false)
      }
    }

    fetchExcelData();
  }, []);

  const getColumn = (data, c) => {
    return data.map((o) => {return {'level': o.level, 'exp': o[c]}})
  }
  // useEffect(() => {
  //   handleOnChangeStar(star)
  // }, [])

  function fetch(){

  }

  const handleOnChangeStar = async (starSelected) => {
    setStar(starSelected)
    setFilterGem(gems[starSelected])
    const jsonData = await readExcelAsList("/datas/gems.xlsx", `${starSelected} star`);
    setFilterData(getColumn(jsonData, color))
    // setFilterData(data.map((o) => {return {'level': o.level, 'exp': o[color]}}))
  }

  const handleOnChangeColor = async (colorSelected) => {
    setColor(colorSelected)
    const jsonData = await readExcelAsList("/datas/gems.xlsx", `${star} star`);
    setFilterData(getColumn(jsonData, colorSelected))
    // setFilterData(data.map((o) => {return {'level': o.level, 'exp': o[colorSelected]}}))
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div>
      <div>
        <button onClick={() => handleOnChangeStar(5)}>5 star</button>
        <button onClick={() => handleOnChangeStar(6)}>6 star</button>
      </div>
      <div>
        {
          filterGem.map((gem) => (
            <img 
              src={`/images/gems/${star}_${gem}.png`} 
              alt={gem} key={gem}
              onClick={() => handleOnChangeColor(gem)}
            />
          ))
        }
      </div>
      <h1>{color}</h1>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Level</th>
            <th>Exp</th>
            <th>Belly</th>
          </tr>
        </thead>
        <tbody>
          {
            filterData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.level}</td>
                <td>{numberWithCommas(parseInt(row.exp))}</td>
                <td>{numberWithCommas(Math.floor(parseInt(row.exp) * parseFloat(140)))}</td>
                {/* <td>{numberWithCommas(Math.floor(parseInt(row.exp) * parseFloat(metaData['exp_per_belly'])))}</td> */}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default UpgradeInfo;
