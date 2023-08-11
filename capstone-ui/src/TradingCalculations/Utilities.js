import axios from "axios";
import MovingAverageCrossover from "./MovingAverageCrossover";
import Divergence from "./Divergence";
import PairsTrading from "./PairsTrading";
import chalk from "chalk";
import { last } from "lodash";

export default class Utilities {
  static selectedStocks = ["META", "AMZN", "NFLX", "CRM", "GOOGL"];
  static selectedStrategy = "";
  static numberOfDBCalls = 0;
  static strategyTrades = [];
  static finishedExecutingStrategy = false;

  static async fetchHistoricalData(
    ticker,
    startDate,
    endDate = new Date().toISOString().split("T")[0]
  ) {
    this.numberOfDBCalls = this.numberOfDBCalls + 1;
    try {
      const res = await axios.post(
        "https://stock-swap.onrender.com/trans/historical",
        {
          ticker: ticker,
          startDate: startDate,
          endDate: endDate,
        }
      );
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

  static async runCurrentStrategy(strategy) {
    let today = new Date();
    let lastActive = new Date(strategy.last_active);
    if (lastActive.toLocaleDateString() != today.toLocaleDateString()) {
      const strategyPromises = [];
      switch (strategy.strategy_name) {
        case "meanreversion":
          strategyPromises.push(this.runMeanReversionStrategy());
          break;
        case "movingaveragecrossover":
          strategyPromises.push(
            this.getMovingAverageCrossoverTransactionHistory(
              this.selectedStocks,
              strategy
            )
          );
          break;
        case "divergence":
          strategyPromises.push(
            this.getDivergenceTransactionHistory(this.selectedStocks, strategy)
          );
          break;
        case "pairstrading":
          strategyPromises.push(
            this.getPairsTradingTransactionHistory(
              this.selectedStocks,
              strategy
            )
          );
          break;
        default:
          console.log("Invalid strategy type.");
          break;
      }

      await Promise.all(strategyPromises);
    } else {
      console.log(
        "User either has no strategy or their strategy is up to date"
      );
    }
  }

  static getPairsTradingTransactionHistory(selectedStocks, strategy) {
    return new Promise(async (resolve, reject) => {
      await PairsTrading.calculateProfit(selectedStocks, strategy.buying_power);
      const transactionHistory =
        await PairsTrading.getUnfilteredTransactionHistory();
      console.log(transactionHistory);
      await this.compareTransactionHistory(transactionHistory, strategy);
      resolve();
    });
  }

  static getMovingAverageCrossoverTransactionHistory(selectedStocks, strategy) {
    return new Promise(async (resolve, reject) => {
      await MovingAverageCrossover.calculateDisplayedProfit(
        strategy.buying_power,
        selectedStocks
      );
      let transactionHistory = await MovingAverageCrossover.getUnfilteredData();
      console.log(transactionHistory);
      await this.compareTransactionHistory(transactionHistory, strategy);
      resolve();
    });
  }

  static getDivergenceTransactionHistory(selectedStocks, strategy) {
    return new Promise(async (resolve, reject) => {
      console.log(selectedStocks);
      await Divergence.calculateDisplayedProfit(
        strategy.buying_power,
        selectedStocks
      );
      const transactionHistory = await Divergence.getUnfilteredData();
      await this.compareTransactionHistory(transactionHistory, strategy);
      resolve();
    });
  }

  static async addTransaction(transaction, strategy) {
    try {
      const res = await axios.post(
        `https://stock-swap.onrender.com/trans/${transaction.type}`,
        {
          ticker: transaction.ticker,
          quantity: 1,
          curr_price: transaction.price,
          user_id: strategy.user_id,
          trans_type: transaction.type,
          purchased_by: strategy.strategy_name,
          transaction_date: transaction.date,
        }
      );
      if (res.status === 201) {
        this.strategyTrades.push({
          ticker: transaction.ticker,
          quantity: 1,
          curr_price: transaction.price,
          user_id: strategy.user_id,
          trans_type: transaction.type,
          purchased_by: strategy.strategy_name,
          transaction_date: transaction.date,
        });
        console.log(
          chalk.green("Transaction successfully executed from the strategy")
        );
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static compareTransactionHistory(transactionHistory, strategy) {
    return new Promise(async (resolve, reject) => {
      const lastActive = await this.toStartDay(strategy.last_active);
      for (const transaction of transactionHistory) {
        if (transaction.date >= lastActive) {
          console.log("date", transaction.date, "last ran ", lastActive);
          await this.addTransaction(transaction, strategy);
        }
      }
      let today = new Date();
      await this.updateLastActive(today.toISOString(), strategy.user_id);
      await this.updateAccountValue(strategy.user_id);

      resolve(); // resolve the promise when everything is done
    });
  }

  static async updateLastActive(date, userId) {
    //Updates the date of the current strategy
    try {
      const res = await axios.post(
        "https://stock-swap.onrender.com/strategy/active",
        {
          date: date,
          user_id: userId,
        }
      );
    } catch (err) {
      console.log(err.response.data);
    }
  }

  static async toStartDay(isoString) {
    let date = new Date(isoString);
    date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds and milliseconds to 0
    return date.toISOString();
  }
  static updateAccountValue(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `https://stock-swap.onrender.com/strategy/update/${userId}`
        );
        console.log("Total share value updated");
        console.log(this.strategyTrades);
        resolve(); // Move this inside the try block
      } catch (error) {
        console.log(error);
        reject(error); // Add this to reject the Promise when there's an error
      }
    });
  }

  static async getStrategyTrades() {
    return this.strategyTrades;
  }
}
