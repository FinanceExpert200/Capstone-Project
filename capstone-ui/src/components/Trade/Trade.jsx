import * as React from "react";
import axios from "axios";
import { useEffect } from "react";


export default function Trade({updateStockPrice, tickers, metaPrice, amznPrice, nflxPrice, googlPrice, crmPrice, getStockPrice}) {


    useEffect(() => {
        // getStockPrice("META");
        updateStockPrice(tickers)
      }, []);



    
  return (
    <div className="trade-page">
        
    
    
    {/* <h1>{metaPrice}</h1> */}



    </div>

  );
}
