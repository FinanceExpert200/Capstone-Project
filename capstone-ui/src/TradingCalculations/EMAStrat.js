import axios from "axios";

import Assets from "./Assets";

// global variables

let botTransactions = [];
let stockCount = 0;
// let profit = 0;
let botAccValue = 5000;
let botBuyingPower = 0;
// const tickers = ["META", "AMZN", "NFLX", "GOOGL", "CRM"];

let profitYear = 0;
let profitSixMonths = 0;
let profitThreeMonths = 0;

export default class EMAStrat {
  static async mainFunc(budget, selectedTickers) {
    this.setBuyingPower(budget);

    // console.log("this is the bot buying power", botBuyingPower);

    // run a for loop where we go through each ticker and calculate the moving averages and execute the trades
    selectedTickers.forEach((ticker) => {
      this.calcPrevProfit(ticker);
    });


  }

  static async calcPrevProfit(ticker) {
    const oneYearAgo = Assets.getDateOffset(-365);
    const yearHistoricalData = await Assets.fetchHistoricalData(
      ticker,
      oneYearAgo,
      Assets.getCurrDate()
    );



    for (let i = 0; i < yearHistoricalData.length; i++) {
      let TwelveDayWindow = yearHistoricalData.slice(i, i + 12);

      let TwentySixDayWindow = yearHistoricalData.slice(i, i + 26);

      // put the closings of this historical data into an array
      let TwelveDayClosings = TwelveDayWindow.map((day) => {
        return day.close;
      });

      let TwentySixDayClosings = TwentySixDayWindow.map((day) => {
        return day.close;
      });

      let nineDayClosings = yearHistoricalData.slice(i, i + 9).map((day) => {
        return day.close;
      });

      const TwelveDayEMA = this.getEMA(
        TwelveDayClosings.length,
        TwelveDayClosings
      );
      const TwentySixDayEMA = this.getEMA(
        TwentySixDayClosings.length,
        TwentySixDayClosings
      );

      const macdLine = [];

      // Calculate the MACD Line for each day
      for (let i = 0; i < TwelveDayEMA.length; i++) {
        const macd = TwelveDayEMA[i] - TwentySixDayEMA[i];
        macdLine.push(macd);
      }

      // console.log("this is the macdLINE", macdLine);

      const sigLine = this.calculateSignalLine(macdLine);

      // console.log("this is the signal line", sigLine);

      // console.log("this is the twelvedayema", TwelveDayEMA);
      // console.log("this is the ", TwentySixDayEMA);

      this.compareMACDandSignalLine(macdLine, sigLine, TwelveDayWindow, ticker);

      // console.log("this is the bot transactions", botTransactions);

      // console.log("this is the avgbuy price", Assets.getAvgBuyPrice(botTransactions));

      // console.log("this is the closing price", TwelveDayClosings)
      // console.log("this is the avg buy price", Assets.getAvgBuyPrice(botTransactions));

      if (
        TwelveDayClosings[TwelveDayClosings.length - 1] >
          Assets.getAvgBuyPrice(botTransactions) &&
        stockCount > 0
      ) {

        const currentProfit =
          TwelveDayClosings[TwelveDayClosings.length - 1] -
          Assets.getAvgBuyPrice(botTransactions);

        

        profitYear += currentProfit;


        if (i >= yearHistoricalData.length - 123) {
          profitSixMonths += currentProfit;
        }


        if (i >= yearHistoricalData.length - 62) {
          profitThreeMonths += currentProfit;
        }






        botTransactions.push({
          Type: "Sell",
          Price: TwelveDayClosings[TwelveDayClosings.length - 1],
          Ticker: ticker,
          Date: TwelveDayWindow[TwelveDayWindow.length - 1].date,
        });
        stockCount -= 1;
      }
    }

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




    // reseting the state for each stock
    botBuyingPower = 5000;
    botAccValue = 5000;
    stockCount = 0;
    // profit = 0;
    profitYear = 0;
    profitSixMonths = 0;
    profitThreeMonths = 0;
    botTransactions = [];




  }

  static compareMACDandSignalLine(
    macdLine,
    signalLine,
    TwelveDayWindow,
    ticker
  ) {
    for (let i = 1; i < macdLine.length; i++) {
      const macdCurrent = macdLine[i];
      const signalCurrent = signalLine[i];
      // const macdPrevious = macdLine[i - 1];
      // const signalPrevious = signalLine[i - 1];

      if (TwelveDayWindow[TwelveDayWindow.length - 1].close > botBuyingPower) {
        console.log("NOT ENOUGH MONEY TO BUY");
      } else if (
        TwelveDayWindow[TwelveDayWindow.length - 1].close < botBuyingPower &&
        macdCurrent > signalCurrent
      ) {
        botTransactions.push({
          Type: "Buy",
          Price: TwelveDayWindow[TwelveDayWindow.length - 1].close,
          Ticker: ticker,
          Date: TwelveDayWindow[TwelveDayWindow.length - 1].date,
        });

        stockCount += 1;

        botBuyingPower -= TwelveDayWindow[TwelveDayWindow.length - 1].close;
      }
    }
  }

  static calculateSignalLine(macdLine) {
    const signalLine = [];
    const dayRange = 9;

    signalLine.push(macdLine[0]);

    for (let i = 1; i < macdLine.length; i++) {
      const ema =
        (macdLine[i] - signalLine[i - 1]) * (2 / (dayRange + 1)) +
        signalLine[i - 1];
      signalLine.push(ema);
    }

    return signalLine;
  }

  static getEMA(dayRange, closingPrices) {
    const smoothingFactor = 2 / (dayRange + 1);
    const emaValues = [];
    let prevEMA = closingPrices[0];

    emaValues.push(prevEMA);

    for (let i = 1; i < closingPrices.length; i++) {
      const currentPrice = parseFloat(closingPrices[i]);
      const ema =
        currentPrice * smoothingFactor + prevEMA * (1 - smoothingFactor);
      emaValues.push(ema);
      prevEMA = ema;
    }

    return emaValues;
  }

  static getTwelveDayEMA(currPrice, prevEMA) {}

  static getTwentySixDayEMA(currPrice, prevEMA) {}

  static setBuyingPower(amount) {
    botBuyingPower = amount;
  }
}
