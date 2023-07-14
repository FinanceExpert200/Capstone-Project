import * as React from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";


export default function Trade({
  updateStockPrice,
  tickers,
  metaPrice,
  amznPrice,
  nflxPrice,
  googlPrice,
  crmPrice,
  getStockPrice,
  stockInfo,
}) {
  useEffect(() => {
    updateStockPrice(tickers);
  }, []);

  console.log("ticker", tickers);
  const handleRefresh = async () => {
    updateStockPrice(tickers);
  };

  return (
    <div className="trade-page">
      <form className="login-form" onSubmit={(event) => handleRefresh(event)}>
        <button type="submit" className="refresh-button">
          Refresh
        </button>
      </form>
      

      <Link to={`1`}>
        <h1> Meta: {metaPrice}</h1>
      </Link>


      <Link to={`2`}>
        <h1> Netflix: {nflxPrice}</h1>
      </Link>

      <Link to={`3`}>
        <h1> Google: {googlPrice}</h1>
      </Link>
      
      <Link to={`4`}>
        <h1> Salesforce: {crmPrice}</h1>
      </Link>
      
      
      
    </div>
  );
}
