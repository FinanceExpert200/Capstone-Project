import axios from "axios"
import MovingAverageCrossover from "./MovingAverageCrossover"

export default class Utilities{
  static selectedStocks = []
  static selectedStrategy = ''
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

    static async runCurrentStrategy(strategy){
      // First we need to determine if the user even has a strategy and if the last active != todays date.  If Both conditions are not met then we are finished with our function
      let today = new Date() 
      if(strategy&& strategy.last_active != timeDay.toISOString()){
        console.log("user has a strategy that has not been ran today, running said strategy")
        // now we need a switch statement to figure our our strategy using a switch case
        switch (strategy.strategy_name) {
          case "meanreversion":
              console.log("meanreversion");
              this.runMeanReversionStrategy();
              break;
          case "movingaveragecrossover":
              //check if at least one item is selected in selectedButtons 
              if (selectedButtons.length >= 1) {
                  this.runMovingAverageCrossoverStrategy(selectedButtons);

              }
              break;
          case "divergence":
              console.log("divergence");
              this.runDivergenceStrategy(selectedButtons);
              break;
          case "pairstrading":
              console.log("pairstrading");
              this.runPairsTradingStrategy(selectedButtons);
              break;
          default:
              console.log("Invalid strategy type.");
              break;
        }
      }
      else{
        console.log("User either has no strategy or their strategy is up to date")
      }
    }

    static async runMovingAverageCrossoverStrategy(){
      console.log(selectedStocks)
      let transactionHistory = await MovingAverageCrossover.calculateDisplayedProfit(simulatedBuyingPower, selectedStocks)
      let accountValue = await MovingAverageCrossover.getAccountValue()
      
      
    };

    static async compareTransactionHistory(transactionHistory){
      
    }




    




}