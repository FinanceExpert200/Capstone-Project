import * as React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Trade.css";
import Trading from "../../TradingCalculations/Trade.js";
import axios from "axios";

export default function Trade({
  updateStockPrice,
  tickers,
  stockData
}) {
  useEffect(() => {
    updateStockPrice(tickers);
  }, []);
//UNDO THIS
  //console.log("ticker", tickers);
  const handleRefresh = async () => {
    updateStockPrice(tickers);
  };


  return (
    <div className="trade-page">
      <form className="refresh-form" onSubmit={(event) => handleRefresh(event)}>
        <button type="submit" className="refresh-button">
          Refresh
        </button>
      </form>

      {Object.keys(stockData).map((stockId) => (
        <Link to={stockId} key={stockId}>
          <h1>
            {stockData[stockId].stockName}: {stockData[stockId].stockPrice}
          </h1>
        </Link>
      ))}
    </div>
  );
}
