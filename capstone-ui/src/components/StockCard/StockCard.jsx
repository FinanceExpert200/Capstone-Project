// import "../ProductDetail/.css"
import "./StockCard.css";
import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StockCard({
  updateStockPrice,
  tickers,
  stockData,
  currentUserId
}) {
  const { stockId } = useParams();
  const stockInfo = stockData[stockId];

  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    setQuantity(parsedQuantity);
  };

  // updates the stock price on the page as you open it
  useEffect(() => {
    updateStockPrice(tickers);
  }, []);

  const addTransaction = async (
    event,
    ticker,
    quantity,
    curr_price,
    trans_type
  ) => {
    try {
      event.preventDefault();

      updateStockPrice(tickers);

      const res = await axios.post(`http://localhost:3001/trans/${trans_type}`, {
        ticker: ticker,
        quantity: quantity,
        curr_price: curr_price,
        user_id: currentUserId,
        trans_type: trans_type,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // here will be some sort of function that displays the stock graph, and just overall infromation based on the stock id that is passed
  return (
    <div className="stock-card">
      {stockInfo && (
        <div className="buy-component">
          <h1>
            {stockInfo.stockName}: {stockInfo.stockPrice}
          </h1>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              onChange={(event) => handleQuantityChange(event.target.value)}
            />
          </div>
          <button
            onClick={(event) =>
              addTransaction(
                event,
                stockInfo.stockName,
                quantity,
                stockInfo.stockPrice,
                "buy"
              )
            }
          >
            Buy
          </button>
          <button
            onClick={(event) =>
              addTransaction(
                event,
                stockInfo.stockName,
                quantity,
                stockInfo.stockPrice,
                "sell"
              )
            }
          >
            Sell
          </button>
        </div>
      )}
    </div>
  );
}
