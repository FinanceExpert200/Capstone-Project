import axios from "axios";

export default class Assets {
  static async fetchHistoricalData(ticker, startDate, endDate) {
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

  static getDateOffset(days, baseDate = new Date()) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + days);
    return this.formatDate(targetDate);
  }

  static getCurrDate() {
    let currDate = this.formatDate(new Date());
    return currDate;
  }

  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  static async getStockPrice(ticker) {}

  static setBuyingPower(amount) {
    botBuyingPower = amount;
  }

  static getAvgBuyPrice(botTransactions) {
    let avg_price = 0;
    let botBuy = 0;

    // if (currPrice == 0) {
    //   botBuy = 0;
    // }

    // avg_price += currPrice;

    // console.log(botTransactions);

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

    // return avg_price;
  }
}
