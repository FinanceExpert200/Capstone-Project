import axios from "axios"

export default class Utilities{
  static numberOfDBCalls = 0 

    //Fetches HISTORICAL data for a specific stock
    static async fetchHistoricalData(ticker, startDate, endDate = new Date().toISOString().split('T')[0]) {
      this.numberOfDBCalls = this.numberOfDBCalls + 1
      console.log("FETCHING FROM THE DATABASE, CALLS MADE THIS REQUEST ARE ", this.numberOfDBCalls)

        try {
          const res = await axios.post('http://localhost:3001/trans/historical', {
            ticker: ticker,
            startDate: startDate,
            endDate: endDate,
          });
          console.log(res.data);
          return res.data.result;
        } catch (err) {
          console.log(err);
        }
    }

    // gets teh date prior to the day you input and returns it in a form that can be used for the yfinance api
    static getDatePrior(days) {
        const d = new Date();
        d.setDate(d.getDate() - days);
        const year = d.getFullYear();
        const month = this.formatNumber(d.getMonth() + 1);
        const day = this.formatNumber(d.getDate());
        return `${year}-${month}-${day}`;
      }
    
      // Helper function to format a number with leading zero if less than 10
      static formatNumber(num) {
        return num < 10 ? `0${num}` : num.toString();
      }




}