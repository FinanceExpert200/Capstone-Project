
import MovAvgTrading from "../../TradingCalculations/MovingAverageCrossover.js"
import React from 'react'


const runStrategy = async(event) =>{
    event.preventDefault()
    MovAvgTrading.calculateDisplayedProfit(5000)
}   

const TradingStrategies = () => {
  return (
    <div>Moving Averaeg Crossover Strategy
        <button onClick={runStrategy}>Run Strategy</button>
        
        <div>Account value after 3 months {MovAvgTrading.totalThreeMonthProfit}, Account value after 6 months {MovAvgTrading.totalSixMonthProfit}, Account value after 1 year {MovAvgTrading.botAccountValue}</div>

    </div>
  )
}

export default TradingStrategies