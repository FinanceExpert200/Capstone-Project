import axios from 'axios';
import chalk from 'chalk';

export default class Trading {
  // Define class properties with default values
  static botBuyingPower = 0;
  static botAccountValue = 0 ;
  static ownedStock = 0;
  static threeMonthProfit = 0;
  static sixMonthProfit = 0;
  static yearProfit = 0;
  static totalIncrease = 0;
  static totalAccountValue = 0
  static totalThreeMonthProfit = 0;
  static totalSixMonthProfit = 0;
  static botTransactionHistory = []


  // Function to get the current buying power
  static getBuyingPower() {
    return this.botBuyingPower;
  }

  // Function to set the buying power
  static setBuyingPower(amount) {
    this.botBuyingPower = amount;
  }

  // Function to calculate the moving average of a given date range
  static calculateMovingAverage(historicalData, startDate, endDate, ticker) {
    const filteredData = historicalData.filter((item) => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= new Date(startDate).getTime() && itemDate <= new Date(endDate).getTime();
    });

    if (filteredData.length === 0) {
      console.log('No data available for the specified date range.');
      return null;
    }

    const totalItems = filteredData.length;
    let sum = 0;

    filteredData.forEach((individualDay) => {
      sum += individualDay.close; // Assuming the property name is "close"
    });

    const movingAverage = sum / totalItems;
    const currentPrice = filteredData[filteredData.length - 1].close;
    const currentDate = filteredData[filteredData.length - 1].date;

    this.compareMovingAverage(currentPrice, movingAverage,ticker, currentDate);

    return movingAverage;
  }

  // Function to compare the moving average with the current price and make buying/selling decisions
  static async compareMovingAverage(currentPrice, movingAverage,ticker,date) {
    const percentIncrease = ((currentPrice - movingAverage) / movingAverage) * 100;
    this.totalIncrease += percentIncrease;


    if (percentIncrease < -10) {
      if (this.botBuyingPower > currentPrice) {
        this.botBuyingPower -= currentPrice;
        this.ownedStock += 1;
        this.botAccountValue = this.botBuyingPower + this.ownedStock * currentPrice;

        console.log(chalk.bgBlack.yellowBright(`${ticker} stock has been purchased at ${currentPrice}, our value left is ${this.botBuyingPower}, we have a total of ${this.ownedStock} and our account value is ${this.botAccountValue}`));
        this.botTransactionHistory.push({ticker: ticker, type: "buy", date: date, price: currentPrice, buyingPower: this.botBuyingPower, accountValue: this.botAccountValue})
      } else {
        console.log(chalk.redBright(`NOT ENOUGH MONEY TO BUY THE STOCK------- Buying Power: ${this.getBuyingPower()}`));
      }
    }

    if (percentIncrease > 10) {
      if (this.ownedStock > 0) {
        this.botBuyingPower += currentPrice;
        this.ownedStock -= 1;
        this.botAccountValue = this.botBuyingPower + this.ownedStock * currentPrice;
        console.log(chalk.bgGreen(`${ticker} Stock has been sold at ${currentPrice}, our value left is ${this.botBuyingPower}, we have a total of ${this.ownedStock} and our account value is ${this.botAccountValue}`));
        this.botTransactionHistory.push({ticker: ticker, type: "sell", date: date, price: currentPrice, buyingPower: this.botBuyingPower, accountValue: this.botAccountValue})
      }
    }
  }

  // Function to get the stock price for a given ticker
  static async getStockPrice(ticker) {
    try {
      const response = await axios.get(`http://localhost:3001/trans/stock/${ticker}`);
      return response.data.data.c;
    } catch (error) {
      console.error(error);
    }
  }

  // Function to fetch historical data for a given ticker and date range
  static async fetchHistoricalData(ticker, startDate, endDate = new Date().toISOString().split('T')[0]) {
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

  // Function to calculate displayed profit over a year period
  static async calculateIndividualShare(ticker, budgetPerStock) {
    const startDate = this.getDatePrior(550);
    const sixMonthsPrior = this.getDatePrior(180);
    const threeMonthsPrior = this.getDatePrior(90);
    const currentDate = this.getDatePrior(0);

    const oneYearHistoricalData = await this.fetchHistoricalData(ticker, startDate);

    let leftPointer = 0;
    let rightPointer = 100;

    this.botAccountValue = budgetPerStock;
    this.botBuyingPower = budgetPerStock;
    this.threeMonthProfit = 0;
    this.sixMonthProfit = 0;

    console.log(`Starting account balance for ${ticker}: ${this.botAccountValue}`);

    console.log(
      chalk.bgMagentaBright(`3 months ${threeMonthsPrior} 6 months ${sixMonthsPrior}, 1 Year ${this.botAccountValue}, length 6 ${(oneYearHistoricalData.length / 4) * 3}`)
    );

    while (rightPointer != oneYearHistoricalData.length) {
      this.calculateMovingAverage(oneYearHistoricalData, oneYearHistoricalData[leftPointer].date, oneYearHistoricalData[rightPointer].date, ticker);

      if (rightPointer == Math.round((oneYearHistoricalData.length / 4) * 3)) {
        this.threeMonthProfit = this.botAccountValue;
      }

      if (rightPointer == Math.round(oneYearHistoricalData.length / 2)) {
        this.sixMonthProfit = this.botAccountValue;
      }

      rightPointer = rightPointer + 1;
      leftPointer = leftPointer + 1;
    }

    console.log(chalk.bgGreen(`FINAL PROFITS of ${ticker}: 3 months ${this.threeMonthProfit}, 6 months ${this.sixMonthProfit}, 1 Year ${this.botAccountValue}`));
    return [this.threeMonthProfit, this.sixMonthProfit, this.botAccountValue];
  }


  // Function to get the date prior to a given number of days in string form
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

  static async calculateDisplayedProfit(budget, tickerArray) {
    const totalBudget = budget; // Total budget to allocate among all stocks
    const budgetPerStock = totalBudget / tickerArray.length; // $1000 for each stock

    this.totalThreeMonthProfit = 0;
    this.totalSixMonthProfit = 0;

   for (let i = 0; i < tickerArray.length; i++) {
    let profit = await this.calculateIndividualShare(tickerArray[i], budgetPerStock);
    this.addToTotal(profit);
    }

    // console.log(`AMAZON  ---------------------------------------------------`);
    // let profitAmzn = await this.calculateIndividualShare("AMZN", budgetPerStock);
    // this.addToTotal(profitAmzn)
    // console.log("---------------------------AAPL---------------------------------");
    // let profitAppl= await this.calculateIndividualShare("AAPL", budgetPerStock);
    // this.addToTotal(profitAppl)
    // console.log("---------------------META---------------------------------------");
    // let profitMeta = await this.calculateIndividualShare("META", budgetPerStock);
    // this.addToTotal(profitMeta)
    // console.log("--------------------------GOOGL----------------------------------");
    // let profitGoogl = await this.calculateIndividualShare("GOOGL", budgetPerStock);
    // this.addToTotal(profitGoogl)
    // console.log("----------------------CRM--------------------------------------");
    // let profitCrm = await this.calculateIndividualShare("CRM", budgetPerStock);
    // this.addToTotal(profitCrm)



    console.log(`TOTAL ${this.totalAccountValue}, 3 months ${this.totalThreeMonthProfit}, 6 months ${this.totalSixMonthProfit}`);
    console.log(this.botTransactionHistory)
    return this.botTransactionHistory
  }

  static async addToTotal(profits){
    
    this.totalThreeMonthProfit = this.totalThreeMonthProfit+ profits[0]
    this.totalSixMonthProfit = this.totalSixMonthProfit+  profits[1]
    this.totalAccountValue = this.totalAccountValue+ profits[2]
    console.log(chalk.bgBlue.white(`adding ${profits[2]} to our total, new total is ${this.totalAccountValue}`))

  }
  static async resetBotAmount(amount){
    this.botAccountValue = amount
    this.botBuyingPower = amount
  }


  static getAccountValue(){
    console.log("ACCOUNT VALUE CALLED")
    console.log(`${this.totalThreeMonthProfit}, ${this.totalSixMonthProfit}, ${this.totalAccountValue}`)
    return [this.totalThreeMonthProfit, this.totalSixMonthProfit, this.totalAccountValue]; 
  }



}

