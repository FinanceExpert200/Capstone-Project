// import "../ProductDetail/.css"
import "./StockCard.css";
import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StockCard({ metaPrice, updateStockPrice, tickers }) {
  const { stockId } = useParams();



  useEffect(() => {
    updateStockPrice(tickers);
  }, []);

  // here will be some sort of function that displays the stock graph, and just overall infromation based on the stock id that is passed

  return (
    <div className="stock-card">


    {/* {stockId === "1" && (



        <div className="buy-component">



        </div>



        <h1>
            Meta: {metaPrice}
        </h1>



    )} */}






      here we will display the stock graph, and just overall infromation based
      on the stock id that is passed



        




    </div>
  );
}
