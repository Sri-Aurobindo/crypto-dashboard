import axios from 'axios';
import React from 'react';
import './coin.css'
const coin = ({name,image,symbol,price,volume,percentageChange,marketCap}) => {
  return <div className = "coin-container"> 
            <div className = "coin-row"> 
                <div className = "coin"> 
                    <img src={image} alt="crypto"/>
                    <h1>{name}</h1>
                    <p className='coin-symbol'>{symbol}</p>
                </div>
                <div className = "coin-data">
                    <p className='coin-price'>${price}</p>
                    {/* marketCap.toLocaleString() - for comma seperated values (eg : $234,142,562) */}
                    {/* conditionally rendering marketcap for null values */}
                    {marketCap ? <p className='coin-market-cap'>MC ${marketCap.toLocaleString()}</p>
                    : <p className='coin-market-cap'>MC ${marketCap}</p>    
                    }

                    {percentageChange<0?
                    <p className='coin-percent red'>{percentageChange}%</p>
                    :<p className='coin-percent green'>{percentageChange}%</p>}
                    
                
                    {volume ? <p className='coin-volume'>V ${volume.toLocaleString()}</p>
                    : <p className='coin-volume'>V ${volume}</p>
                    }
                    </div>
            </div>
        </div>
};

export default coin;

