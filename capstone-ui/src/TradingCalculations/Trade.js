import axios from 'axios';
// import Chart from 'chart.js';
export default class Trading {
  // Volatility Breakout Strategy
  // Get the 100 day moving average and compare it to the current price
  // If the current price is below the moving average by a certain percent (%5 maybe), we can purchase the stock
  // If we already have a stock and the current price is above the moving average, then we sell the stock.
  //Calculates the moving average of a stock starting from the startDate and ending at the current date
  static calculateMovingAverage(historicalData, startDate, endDate) {
    const filteredData = historicalData.filter((item) => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= new Date(startDate).getTime() && itemDate <= new Date(endDate).getTime();
    });
    if (filteredData.length === 0) {
      console.log('No data available for the specified date range.');
      return null; // Return null or any suitable value indicating no data
    }
    let totalItems = filteredData.length;
    let sum = 0;
    filteredData.forEach((individualDay) => {
      sum += individualDay.close;
    });
    let movingAverage = sum / totalItems;
    let currentPrice = filteredData[filteredData.length - 1].close;
    let currentDate = filteredData[filteredData.length - 1].date;
    //UNDO THIS
    //console.log(`Moving Average: ${movingAverage}, Current Price: ${currentPrice} Date ${currentDate}`);
    this.compareMovingAverage(currentPrice, movingAverage);
    return movingAverage;
  }
    //compare the moving average with the current price, if the current price is below a certain percentage, we buy
    static async compareMovingAverage(currentPrice, movingAverage){
        //if todays stock is 5% below the moving avg, we buy
        //(2% decrease or higher)
        let percentIncrease = ((currentPrice - movingAverage) / movingAverage) * 100;
        //UNDO THIS
        //console.log("Percent Increase", percentIncrease)
        //If PercentIncrease is negative 2 or lower, we want to buy a share of the stock (call buy share from transaction route)
        if (percentIncrease < -1){
          //UNDO THIS
          //console.log(`We buy the stock`)
        }
    }
    static async getStockPrice(ticker) {
        try {
          const response = await axios.get(
            `http://localhost:3001/trans/stock/${ticker}`
          );
          //UNDO THIS
          //console.log(response.data.data)
          return response.data.data.c
        } catch (error) {
            console.error(error);
        }
    };
  static async fetchHistoricalData(ticker, startDate, endDate){
    //if endDate is left undefined, it defaults to today
    //UNDO THIS
    //console.log("FETCHING THE API")
    try {
        const res = await axios.post(`http://localhost:3001/trans/historical`, {
          ticker: ticker,
          startDate: startDate,
          endDate: endDate
        });
//UNDO THIS
        //console.log(res.data);
        return res.data.result
      } catch (err) {
        console.log(err);
    }
  }
  // Now that we hae all of the pieces, we want to put them all together.
  // We need to calculate TOTAL PROFIT OF THE STRATEGY
  // - first we need to determine when to buy and sell over a year period
  //  -find data starting from 450 days back
  //  - calculate the moving average
  static async calculateDisplayedProfit(ticker) {
    let startDate = this.getDatePrior(465);
    let endDate = this.getDatePrior(365);
    const threeMonthsPrior = this.getDatePrior(180);
    const oneMonthPrior = this.getDatePrior(90);
    const currentDate = this.getDatePrior(0);
    const oneYearHistoricalData = await this.fetchHistoricalData(ticker, startDate);
    let count  = 0
    while (count < 20) {
      let currMovingAverage = this.calculateMovingAverage(oneYearHistoricalData, startDate, endDate);
      //UNDO THIS
      //console.log(`startdate: ${startDate}, endDate ${endDate}. Moving avg: ${currMovingAverage}. We stop at ${currentDate}`);
      startDate = this.incrementDateByOneDay(startDate);
      endDate = this.incrementDateByOneDay(endDate);
      // if (threeMonthsPrior === startDate) {
      //   console.log(`WE HIT OUR 3 MONTHS PRIOR MARK, WE RETURN OUR TOTAL PROFIT SO FAR`);
      //   break;
      // }
      if(startDate == currentDate){
        console.log("END OF THE DATA, We are done")
        break
      }
      count = count + 1
    }
  }
  //input amount of days and it returns the date prior in string form
static getDatePrior(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = this.formatNumber(d.getMonth() + 1);
  const day = this.formatNumber(d.getDate());
  return `${year}-${month}-${day}`;
}
  static check
  static formatNumber(num) {
    if (num < 9) {
      return "0" + num.toString();
    }
    return num.toString(); // Add this line
  }
  static incrementDateByOneDay(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().substring(0, 10);
  }
}