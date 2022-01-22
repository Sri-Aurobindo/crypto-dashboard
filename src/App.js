
import './App.css';
import axios from 'axios';
import React,{useState,useEffect} from 'react';
import Coin from "./coin"

//https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h
function App() {
  //using useState hook to implement states in functional component
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState([]);
  const [mcsort,setMcSort] = useState(["angle double down icon"])
  useEffect(()=>{
    
 
    //Api call through axios to get the data
      axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=24h")
      .then(res=> {
        setCoins(res.data)
        })
      .catch(err=>{
        alert("error message", err)
      })
    
    //[search] - execute once initially, then execute when value of search state changes 
  },[search])

  //setInterval(useEffect,10000)
 

  //handleChange updates the search state value 
  function handleChange(e) {
  setSearch(e.target.value);
  console.log(e.target.value);
}
//filters the coin name and check whether the coin is present (includes method)
  const filteredCoins = coins.filter((coin)=>{
    return coin.name.toLowerCase().includes(search)
  })

  
  return (
    <div className="coin-app">
      <div className="coin-search">
        <h1 className="coin-text">Search a crypto currency</h1>
        <form>
          <input type="text" placeholder='search a crypto currency' className='coin-input' onChange={handleChange}/>
        </form>  
      </div>
      <div className = "coin-container"> 
            <div className = "coin-row"> 
                <div className = "coin"> 
                    <h1>Name </h1>
                    
                </div>
                <div className = "coin-data">
                    <p className='coin-price'>Price </p>
                    <p className='coin-market-cap'>Market Cap </p>
                    <p className='coin-percent'>Per Change% </p>
                    <p className='coin-volume'>Volume </p>
                </div>
            </div>
        </div> 
       {filteredCoins.map(
         coin=>{
           return(
            //  passsing data to coin component
             <Coin key={coin.id} name={coin.name} volume = {coin.total_volume} image={coin.image} symbol={coin.symbol} price={coin.current_price} percentageChange = {coin.price_change_percentage_24h} marketCap={coin.market_cap}/>
           )
         }
       )}
    </div>
  );
}

export default App;

//<button className='btn'><i className="angle double down icon "></i></button>

// function sortValues(value){
//   console.log("value",value)
// }