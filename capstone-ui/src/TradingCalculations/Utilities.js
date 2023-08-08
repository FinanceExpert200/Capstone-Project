import axios from "axios"
import MovingAverageCrossover from "./MovingAverageCrossover"
import Divergence from "./Divergence"
import PairsTrading from "./PairsTrading"
import chalk from "chalk"
import { last } from "lodash"



export default class Utilities {
  static selectedStocks = ["META", "AMZN", "NFLX", "CRM", "GOOGL"]
  static selectedStrategy = ''
  static numberOfDBCalls = 0 
  static strategyTrades = []
  static finishedExecutingStrategy = false

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
    let today = new Date() 
    let lastActive = new Date(strategy.last_active)
    if(lastActive.toLocaleDateString() != today.toLocaleDateString()){
      const strategyPromises = [];
      switch (strategy.strategy_name) {
        case "meanreversion":
            strategyPromises.push(this.runMeanReversionStrategy());
            break;
        case "movingaveragecrossover":
            strategyPromises.push(this.getMovingAverageCrossoverTransactionHistory(this.selectedStocks,strategy));
            break;
        case "divergence":
            strategyPromises.push(this.getDivergenceTransactionHistory(this.selectedStocks,strategy));
            break;
        case "pairstrading":
            strategyPromises.push(this.getPairsTradingTransactionHistory(this.selectedStocks,strategy));
            break;
        default:
            console.log("Invalid strategy type.");
            break;
      }
  
      await Promise.all(strategyPromises);
    } else{
      console.log("User either has no strategy or their strategy is up to date")
    }
  }

    static async getPairsTradingTransactionHistory(selectedStocks,strategy){

      await PairsTrading.calculateProfit(selectedStocks,strategy.buying_power)
      const transactionHistory = await PairsTrading.getUnfilteredTransactionHistory()
      console.log(transactionHistory)
      this.compareTransactionHistory(transactionHistory,strategy)
    };


    static async getMovingAverageCrossoverTransactionHistory(selectedStocks,strategy){
      await MovingAverageCrossover.calculateDisplayedProfit(strategy.buying_power, selectedStocks)
      let transactionHistory = await MovingAverageCrossover.getUnfilteredData()
      console.log(transactionHistory)
      this.compareTransactionHistory(transactionHistory,strategy)
    };

    static async getDivergenceTransactionHistory(selectedStocks, strategy){
      console.log(selectedStocks)
      await Divergence.calculateDisplayedProfit(strategy.buying_power, selectedStocks);
      const transactionHistory = await Divergence.getUnfilteredData()
      this.compareTransactionHistory(transactionHistory,strategy)
      
    };

    static async addTransaction(transaction,strategy){
      try {
        const res = await axios.post(`http://localhost:3001/trans/${transaction.type}`, {
          ticker: transaction.ticker,
          quantity: 1,
          curr_price: transaction.price,
          user_id: strategy.user_id,
          trans_type: transaction.type,
          purchased_by: strategy.strategy_name,
          transaction_date: transaction.date

        });
        if (res.status === 201) {
          this.strategyTrades.push({ticker: transaction.ticker,quantity: 1,curr_price: transaction.price,user_id: strategy.user_id,trans_type: transaction.type,purchased_by: strategy.strategy_name,transaction_date: transaction.date})
          console.log(chalk.green("Transaction successfully executed from the strategy"))
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    static async compareTransactionHistory(transactionHistory,strategy){
      const lastActive  = await this.toStartDay(strategy.last_active)
      
      // Since map function doesn't wait for promises, it's better to use a for loop
      for (const transaction of transactionHistory) {
          //console.log(`last active ${lastActive} transaction date ${transaction.date}`)
          if(transaction.date>=lastActive){
              console.log("date", transaction.date , "last ran ", lastActive)
              //we want to perform the transaction 
              await this.addTransaction(transaction, strategy) // await added here
          }
      }
      
      let today = new Date()
      //After running the funciton, we need to update our last active date to today
      await this.updateLastActive(today.toISOString(), strategy.user_id)
      await this.updateAccountValue(strategy.user_id)
  }

    static async updateLastActive(date, userId){
      //Updates the date of the current strategy
      try {
        const res = await axios.post("http://localhost:3001/strategy/active", {
          date: date,
          user_id: userId,
        });
      } catch (err) {
        console.log(err.response.data);
      }
    }

    static async toStartDay(isoString) {
      let date = new Date(isoString);
      date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds and milliseconds to 0
      return date.toISOString();
    } 
    static updateAccountValue = async(userId) => {
      try {
        const res = await axios.get(`http://localhost:3001/strategy/update/${userId}`);
        console.log("Total share value updated")

        
        
        console.log(this.strategyTrades)
    
      } catch(error){
        console.log(error)
      } 
    }
    static async getFinishedStrategy(){
      return finishedExecutingStrategy
    }
    static async getStrategyTrades(){
      return this.strategyTrades
    }



}

