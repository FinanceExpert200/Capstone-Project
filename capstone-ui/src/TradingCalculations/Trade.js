
import axios from 'axios';
import Chart from 'chart.js';






export default class Trading {
  // Volatility Breakout Strategy
  // Get the 100 day moving average and compare it to the current price
  // If the current price is below the moving average by a certain percent (%5 maybe), we can purchase the stock
  // If we already have a stock and the current price is above the moving average, then we sell the stock.
  static async calculateMovingAverage(ticker, period) {
    const ans = await this.fetchHistoricalData(ticker, period)
    console.log(ans)
  }
  static async fetchHistoricalData(ticker, period){
    try {
        const res = await axios.post(`http://localhost:3001/trans/historical`, {
          ticker: ticker,
          period: period
        });
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
  }


}

