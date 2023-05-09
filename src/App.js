
import './App.css';
import axios from 'axios';
import React,{useState,useEffect} from 'react';
import Coin from "./coin"



import AWS from 'aws-sdk';


AWS.config.update({
  region: 'us-west-1',
  endpoint: 'dynamodb.us-west-1.amazonaws.com',
  accessKeyId: '',
  secretAccessKey: ''
});

const dynamodb = new AWS.DynamoDB();



//https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h
function App() {
  
  //using useState hook to implement states in functional component
  
  //coins state - response data
  const [coins, setCoins] = useState([]);
  
  //count state - list number of currencies in a page
  const [count, setCount] = useState([100]);
  
  //order state - order of the data
  const [order, setOrder] = useState(["market_cap_desc"]);
  
  //search - search a currency
  const [search, setSearch] = useState([]);

  //sort - to set the className and symbol of other sorting type states. 
  const [mcsort,setMcSort] = useState(["angle double down icon red"]);
  const [pcsort,setPcSort] = useState(["sort icon"])
  const [pricesort,setPriceSort] = useState(["sort icon"])
  const [volumesort,setVolumeSort] = useState(["sort icon"])
 
  useEffect(()=>{
    
      //Api call through axios to get the data
      //Parameterized the order type and number of currencies to display
        function getData(){ axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${order}&per_page=${count}&page=1&price_change_percentage=24h
        `)
          .then(res=> {
            console.log(res.data[0]);
            putItemToDynamoDB(res.data[0])
            setCoins(res.data)
            })
          .catch(err=>{
            alert("error message", err)
          })
        }

        //initial apicall at the time of deploying/hosting the application
        getData()

        //call (getData function) coingecko api to get the data periodically for the interval of 5 minutes
        setInterval(getData,300000)

        //[search,order,count] - execute once initially, then execute when value of search/order/count state changes
  },[search,order,count])

  
  async function putItemToDynamoDB(data){
    console.log(data.name)
    const params = {
      TableName: 'crypto_dashboard',
      Item: {
        'crypto_id': { S: data.name.toString() },
        'price': { S: data.current_price.toString()},
        'market_cap': { S: data.market_cap.toString() },
        'percentage_change': { S: data.price_change_percentage_24h.toString()},
        'volume': { S: data.total_volume.toString() },
        'symbol': { S: data.symbol.toString() }
        // Add more attributes as needed
      }
    };
  
    try {
      await dynamodb.putItem(params).promise();
      console.log('Item added to DynamoDB!');
    } catch (err) {
      console.error(err);
    }
  };

 


  //handleChange updates the search state value 
  function handleChange(e) {
  setSearch(e.target.value);
  }

  //countChange updates count state
  function countChange(e) {
    setCount(e.target.value);
    }


//handling sorting functionality of all coins based on market_cap/volume/price/percentage_change
function sortCurrency(value){
  switch(value){
    case "mc" :
      //sorting currency value based on market_cap by calling api and changing order state
      if(mcsort === "sort icon"){
        setMcSort("angle double down icon red")
        //setCoins(coins.sort((a,b)=>b.market_cap - a.market_cap ))
        setOrder("market_cap_desc")
      }
      else if(mcsort === "angle double down icon red"){
        setMcSort("angle double up icon green")
        //setCoins(coins.sort((a,b)=>a.market_cap - b.market_cap))
        setOrder("market_cap_asc")
      }else if(mcsort ==="angle double up icon green")
      {
        setMcSort("angle double down icon red")
        //setCoins(coins.sort((a,b)=>b.market_cap - a.market_cap ))
        setOrder("market_cap_desc")
      }
      setPcSort("sort icon")
      setPriceSort("sort icon")
      setVolumeSort("sort icon")
      break;
    
    case "pc" :
      //sorting currency value based on percentage_change by sort function (because order parameter supports only market_cap and volume)
      if(pcsort === "sort icon"){
        setPcSort("angle double down icon red")
        setCoins(coins.sort((a,b)=>b.price_change_percentage_24h - a.price_change_percentage_24h ))
      }
      else if(pcsort === "angle double down icon red"){
        setPcSort("angle double up icon green")
        setCoins(coins.sort((a,b)=>a.price_change_percentage_24h - b.price_change_percentage_24h))
      }else if(pcsort ==="angle double up icon green")
      {
        setPcSort("angle double down icon red")
        setCoins(coins.sort((a,b)=>b.price_change_percentage_24h - a.price_change_percentage_24h ))
      }
      setMcSort("sort icon")
      setPriceSort("sort icon")
      setVolumeSort("sort icon")
      break;
      
    case "price" :
      //sorting currency value based on price using  sorting function (because order parameter supports only market_cap and volume)
      if(pricesort === "sort icon"){
        setPriceSort("angle double down icon red")
        setCoins(coins.sort((a,b)=>b.current_price - a.current_price ))
      }
      else if(pricesort === "angle double down icon red"){
        setPriceSort("angle double up icon green")
        setCoins(coins.sort((a,b)=>a.current_price - b.current_price ))
      }else if(pricesort ==="angle double up icon green")
      {
        setPriceSort("angle double down icon red")
        setCoins(coins.sort((a,b)=>b.current_price - a.current_price ))
      }
      setMcSort("sort icon")
      setPcSort("sort icon")
      setVolumeSort("sort icon")
      break;
    
    case "volume":
      //sorting currency value based on volume by calling api and changing order state
      if(volumesort === "sort icon"){
        setVolumeSort("angle double down icon red")
        //setCoins(coins.sort((a,b)=>b.total_volume - a.total_volume ))
        setOrder("volume_desc")
      }
      else if(volumesort === "angle double down icon red"){
        setVolumeSort("angle double up icon green")
        //setCoins(coins.sort((a,b)=>a.total_volume - b.total_volume ))
        setOrder("volume_asc")
      }else if(volumesort ==="angle double up icon green")
      {
        setVolumeSort("angle double down icon red")
        //setCoins(coins.sort((a,b)=>b.total_volume - a.total_volume ))
        setOrder("volume_desc")
      }
      setMcSort("sort icon")
      setPriceSort("sort icon")
      setPcSort("sort icon")
      break;
      
      default:
        console.log(`Sorry, we are out`);
  }
}

//filters the coin name and check whether the coin is present (includes method)
  const filteredCoins = coins.filter((coin)=>{
    
    return coin.name.toLowerCase().includes(search)
  })

  
  return (
    <div className="coin-app">
      <div className="coin-search">
        <h1 className="coin-text">Crypto Dashboard</h1>
        <form>
          <input type="text" placeholder='search a crypto currency' className='coin-input' onChange={handleChange}/>
          <input type="text" placeholder='100' className='coin-input-pagelist' onChange={countChange}/>
        </form>  
      </div>
      <div className = "coin-container"> 
            <div className = "coin-row"> 
                <div className = "coin"> 
                    <h1>Name </h1>
                </div>
                <div className = "coin-data">
                    <p className='coin-price'>Price <button className='btn' onClick={()=>sortCurrency("price")}><i className={pricesort}></i></button></p>
                    <p className='coin-market-cap'>Market Cap <button className='btn' onClick={()=>sortCurrency("mc")}><i className={mcsort}></i></button></p>
                    <p className='coin-percent'>Per Change% <button className='btn' onClick={()=>sortCurrency("pc")}><i className={pcsort}></i></button></p>
                    <p className='coin-volume'>Volume <button className='btn' onClick={()=>sortCurrency("volume")}><i className={volumesort}></i></button></p>
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



























//   render(){
//     return (
//       <div className="coin-app">
//       <div className="coin-search">
//         <h1 className="coin-text">Search a crypto currency</h1>
//         <form>
//           <input type="text" placeholder='search a crypto currency' className='coin-input' onChange={handleChange}/>
//         </form>  
//       </div>
//       <div className = "coin-container"> 
//             <div className = "coin-row"> 
//                 <div className = "coin"> 
//                     <h1>Name </h1>
                    
//                 </div>
//                 <div className = "coin-data">
//                     <p className='coin-price'>Price </p>
//                     <p className='coin-market-cap'>Market Cap </p>
//                     <p className='coin-percent'>Per Change% </p>
//                     <p className='coin-volume'>Volume </p>
//                 </div>
//             </div>
//         </div> 
//        {filteredCoins.map(
//          coin=>{
//            return(
//             //  passsing data to coin component
//              <Coin key={coin.id} name={coin.name} volume = {coin.total_volume} image={coin.image} symbol={coin.symbol} price={coin.current_price} percentageChange = {coin.price_change_percentage_24h} marketCap={coin.market_cap}/>
//            )
//          }
//        )}
//     </div>
//     )
//   }
// }

// export default App;
