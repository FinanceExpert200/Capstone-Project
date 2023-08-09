import axios from "axios";

let stockCount = 0;

let botTransactions = [];

let thirtyDayMovingAvgArray = [];
let oneTwentyDayMovingAvgArray = [];
let transactionsHistory = [];
let profitArray = [];

let profit = 0;
let botBuyingPower = 0;
let botAccValue = 5000;
// const tickers = ["META", "AMZN", "NFLX", "GOOGL", "CRM"];
// const tickers = ["META", "AMZN", "NFLX", "GOOGL", "CRM"];

let profitYear = 0;
let profitSixMonths = 0;
let profitThreeMonths = 0;

// need to correctly update the botAccValue and botBuyingPower
// the botbuyingpower is not updated correcty take a look at the console logs

export default class MeanReversionStrat {
  static async mainFunc(budget, selectedTickers) {
    this.setBuyingPower(budget / selectedTickers.length);

    for (const ticker of selectedTickers) {
      await this.calcPrevProfit(ticker, budget, selectedTickers);
    }
    //console.log("THE TRADE HISTORY : ", transactionsHistory)
    // selectedTickers.forEach((ticker) => {
    //   this.calcPrevProfit(ticker, budget, selectedTickers);
    // });
  }

  static setBuyingPower(amount) {
    botBuyingPower = amount;
  }

  // the purpose of this function to calculate the profit that you would have made if you had used this strategy in the past
  static async calcPrevProfit(ticker, budget, selectedTickers) {
    const oneYearAgo = this.getDateOffset(-365);

    // we then get the historical data from a year ago today to today
    const yearHistoricalData = await this.fetchHistoricalData(
      ticker,
      oneYearAgo,
      this.getCurrDate()
    );

    console.log("---------------THIS IS FOR-----------------", ticker);

    // now we have this mega forloop that goes through the entire year of data calculating the moving averages and executing the trades
    for (let i = 0; i < yearHistoricalData.length; i++) {
      let thirtyDayWindow = yearHistoricalData.slice(i, i + 21);

      let oneTwentyDayWindow = yearHistoricalData.slice(i, i + 84);

      let thirtyDayMovingAvg = this.getMovingAverage(thirtyDayWindow);
      let oneTwentyDayMovingAvg = this.getMovingAverage(oneTwentyDayWindow);

      thirtyDayMovingAvgArray.push({
        ticker: ticker,
        date: thirtyDayWindow[0].date,
        thirtyDayAverage: thirtyDayMovingAvg,
        close: thirtyDayWindow[0].close,
        twentyOneAverage: oneTwentyDayMovingAvg,
      });

      oneTwentyDayMovingAvgArray.push({
        ticker: ticker,
        date: oneTwentyDayWindow[0].date,
        twentyOneAverage: oneTwentyDayMovingAvg,
      });

      if (thirtyDayWindow[thirtyDayWindow.length - 1].close > botBuyingPower) {
        // console.log("NOT ENOUGH MONEY TO BUY");
      } else if (
        thirtyDayWindow[thirtyDayWindow.length - 1].close < botBuyingPower &&
        oneTwentyDayMovingAvg / thirtyDayMovingAvg - 1 >= 0.1
      ) {
        this.executeBuy(ticker, thirtyDayWindow);
        stockCount += 1;
      }

      if (
        thirtyDayWindow[thirtyDayWindow.length - 1].close >
          this.getAvgBuyPrice(botTransactions, 0) &&
        stockCount > 0
      ) {
        const currentProfit =
          thirtyDayWindow[thirtyDayWindow.length - 1].close -
          this.getAvgBuyPrice(botTransactions, 0);
        // if (i === yearHistoricalData.length - 1) {
        profitYear += currentProfit;
        // }

        if (i >= yearHistoricalData.length - 123) {
          profitSixMonths += currentProfit;
        }

        if (i >= yearHistoricalData.length - 62) {
          profitThreeMonths += currentProfit;
        }

        botTransactions.push({
          Type: "Sell",
          Price: thirtyDayWindow[thirtyDayWindow.length - 1].close,
          Ticker: ticker,
          Date: thirtyDayWindow[thirtyDayWindow.length - 1].date,
        });
        stockCount -= 1;
      }
    }
    console.log("transaction first called ", botTransactions);
    console.log("this is the year profit", profitYear, " for ", ticker);
    console.log(
      "this is the six month profit",
      profitSixMonths,
      " for ",
      ticker
    );
    console.log(
      "this is the three month profit",
      profitThreeMonths,
      " for ",
      ticker
    );

    // console.log("this is AT", thirtyDayMovingAvgArray)

    botTransactions.map((bot) => {
      //console.log('being called here!', bot)
      transactionsHistory.push(bot);
    });
    //console.log('the instance of this trade: ', transactionsHistory)
    profitArray.push({
      [ticker]: { profitThreeMonths, profitSixMonths, profitYear },
    });
    console.log("profit YEAR", profitArray);
    // reseting the state for each stock
    this.setBuyingPower(budget / selectedTickers.length);
    botAccValue = 5000;
    stockCount = 0;

    await this.resetState();
  }

  static async resetState() {
    profitYear = 0;
    profitSixMonths = 0;
    profitThreeMonths = 0;
    //botTransactions = []
    botTransactions.length = 0;
  }

  static executeBuy(ticker, thirtyDayWindow) {
    botTransactions.push({
      Type: "Buy",
      Price: thirtyDayWindow[thirtyDayWindow.length - 1].close,
      Ticker: ticker,
      Date: thirtyDayWindow[thirtyDayWindow.length - 1].date,
      avg_buy_price: this.getAvgBuyPrice(
        botTransactions,
        thirtyDayWindow[thirtyDayWindow.length - 1].close
      ),
    });

    botBuyingPower -= thirtyDayWindow[thirtyDayWindow.length - 1].close;
    // console.log("BUYING POWER:", botBuyingPower);
  }

  static executeSell(thirtyDayWindow) {
    botTransactions.push({
      Type: "Sell",
      Price: thirtyDayWindow[thirtyDayWindow.length - 1].close,
      Ticker: "AMZN",
      Date: thirtyDayWindow[thirtyDayWindow.length - 1].date,
    });

    // botBuyingPower += thirtyDayWindow[thirtyDayWindow.length - 1].close;
  }

  static getAvgBuyPrice(botTransactions, currPrice = 0) {
    let avg_price = 0;
    let botBuy = 1;

    if (currPrice == 0) {
      botBuy = 0;
    }

    avg_price += currPrice;

    for (let i = 0; i < botTransactions.length; i++) {
      //iterate through the bot transactions and see what our avg price of the stocks we have bought is

      if (botTransactions[i].Type == "Buy") {
        avg_price += botTransactions[i].Price;
        botBuy++;
      }

      if (botTransactions[i].Type == "Sell") {
        avg_price -= botTransactions[i].Price;
        botBuy--;
      }
    }
    if (botBuy != 0) {
      avg_price = avg_price / botBuy;
      // console.log(avg_price);
      return avg_price;
    }
    return 0;
  }

  static getDateOffset(days, baseDate = new Date()) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + days);
    return this.formatDate(targetDate);
  }

  static getCurrDate() {
    let currDate = this.formatDate(new Date());
    return currDate;
  }

  static getMovingAverage(historicalData) {
    let dayCount = 0;
    let closePriceSum = 0;
    historicalData.forEach((item) => {
      closePriceSum += item.close;
      dayCount++;
    });

    let movingAverage = closePriceSum / dayCount;

    return movingAverage;
  }

  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  // static async getStockPrice(ticker) {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3001/trans/stock/${ticker}`
  //       );
  //       // console.log(response.data.data)
  //       return response.data.data.c

  //     } catch (error) {
  //         console.error(error);
  //     }
  // };

  static async fetchHistoricalData(ticker, startDate, endDate) {
    //if endDate is left undefined, it defaults to today
    // console.log("FETCHING THE API")
    try {
      const res = await axios.post(
        `http://localhost:3001/trans/historical`,
        {
          ticker: ticker,
          startDate: startDate,
          endDate: endDate,
        }
      );

      // console.log(res.data);
      return res.data.result;
    } catch (err) {
      console.log(err);
    }
  }
  static async getTransactionHistory() {
    const placeholder = transactionsHistory;
    transactionsHistory = [];
    return placeholder;
  }
  static async getProfitArray() {
    const placeholder = profitArray;
    profitArray = [];
    return placeholder;
  }
  static async getThirtyDayAvgArray() {
    return thirtyDayMovingAvgArray;
  }
  static async getOneTwentyDayAvgArray() {
    return oneTwentyDayMovingAvgArray;
  }
}
