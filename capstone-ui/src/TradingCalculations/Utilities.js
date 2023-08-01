import axios from "axios"
import MovingAverageCrossover from "./MovingAverageCrossover"
import Divergence from "./Divergence"


export default class Utilities {
  static selectedStocks = ["META","AAPL"]
  static selectedStrategy = ''
  static numberOfDBCalls = 0 

  static async fetchHistoricalData (ticker,startDate,endDate = new Date().toISOString().split("T")[0]) {
    this.numberOfDBCalls = this.numberOfDBCalls + 1;
    try {
      const res = await axios.post("http://localhost:3001/trans/historical", {
        ticker: ticker,
        startDate: startDate,
        endDate: endDate,
      });
      return res.data.result;
    } catch (err) {
      console.log(err);
    }
  }

  static getDatePrior(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    const year = d.getFullYear();
    const month = this.formatNumber(d.getMonth() + 1);
    const day = this.formatNumber(d.getDate());
    return `${year}-${month}-${day}`;
  }

  static formatNumber(num) {
    return num < 10 ? `0${num}` : num.toString();
  }


    static async runCurrentStrategy(strategy){
      console.log("STRATEGY IN BACKEND ", strategy)
      // First we need to determine if the user even has a strategy and if the last active != todays date.  If Both conditions are not met then we are finished with our function
      let today = new Date() 
      if(strategy&& strategy.last_active != today.toISOString()){
        console.log("user has a strategy that has not been ran today, running said strategy")
        // now we need a switch statement to figure our our strategy using a switch case
        switch (strategy.strategy_name) {
          case "meanreversion":
              console.log("meanreversion");
              this.runMeanReversionStrategy();
              break;
          case "movingaveragecrossover":
                this.getMovingAverageCrossoverTransactionHistory(this.selectedStocks,strategy);
              break;
          case "divergence":
              console.log("divergence");
              this.getDivergenceTransactionHistory(this.selectedStocks,strategy);
              break;
          case "pairstrading":
              console.log("pairstrading");
              this.runPairsTradingStrategy(this.selectedStocks,strategy);
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


    static async getMovingAverageCrossoverTransactionHistory(selectedStocks,strategy){
      console.log(selectedStocks)
      console.log("STRTEGY%%%%%")
      console.log(strategy)
      let transactionHistory = await MovingAverageCrossover.calculateDisplayedProfit(strategy.buying_power, selectedStocks)
      this.compareTransactionHistory(transactionHistory,strategy)


      
    };
    static async getDivergenceStrategyTransactionHistory(selectedStocks,strategy){
      console.log(selectedStocks)
      let transactionHistory = await MovingAverageCrossover.calculateDisplayedProfit(strategy.buying_power, selectedStocks)
    }
  

    static async addTransaction(transaction,strategy){
      console.log("addTransaction Hit")
      try {
        const res = await axios.post(`http://localhost:3001/trans/${transaction.type}`, {
          ticker: transaction.ticker,
          quantity: 1,
          curr_price: transaction.price,
          user_id: strategy.user_id,
          trans_type: transaction.type,
          purchased_by: strategy.strategy_name
        });
        if (res.status === 201) {
          console.log("Transaction successfully executed from the strategy")
        }
      } catch (err) {
        console.log(err);
        //must update the error message
      }
    };
  






    static async getDivergenceTransactionHistory(selectedStocks, strategy){
      console.log(selectedStocks)
      let [transactionHistory, accountValue] = await Divergence.calculateDisplayedProfit(strategy.buying_power, selectedStocks);
    
      this.compareTransactionHistory(transactionHistory,strategy)
      
    };



    static async compareTransactionHistory(transactionHistory,strategy){
      
      transactionHistory.map((transaction) => {
        console.log(`last active ${strategy.last_active} transaction date ${transaction.date}`)
        if(transaction.date>=strategy.last_active){
          //we want to perform the transaction 
          this.addTransaction(transaction, strategy)
        }
      })
    }
}

