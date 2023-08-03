import Utilities from "./Utilities";
import chalk from "chalk";

export default class PairsTrading{
    static stockA = {}
    static stockB = {}

    static stockACount = 0 
    static stockBCount = 0 
    static buyingPower = 0
    static accountValue = 0
    static transactionHistory = []
    static threeMonthProfit = 0 
    static sixMonthProfit = 0 
    static unfilteredTransactionHistory = []
    static priceRatioArray =[]



    static allDataArray = []
  





  //For this strategy, we need to take in two comanies which can be mixed and matched by the user.
  // ---------- Implementation ---------------\\
  // 1. Data Retrieval - Fetch the given comapnies from the api in utilities and store them to static variables since we will need them throughout the entirety of our class
  //      - Gather data for a year right now, we might increase that time period later
  // 2. Calculate the Price Ratio - Now we need to get the price ratio by dividing the price of one asset by the other asset
  // 3. Calculate the Mean and Standard Deviation
  static async fetchPairsData(stockA, stockB, datePrior) {
    //Calclate the date a year prior to today
    let dayPrior = await Utilities.getDatePrior(datePrior);
    // Now we use the yearPrior Date to fetch our data
    this.stockA = await Utilities.fetchHistoricalData(stockA, dayPrior);
    this.stockB = await Utilities.fetchHistoricalData(stockB, dayPrior);
    console.log(`Stock A and Stock B Calculated`);
    this.calculatePriceRatio(this.stockA, this.stockB);
  }

  // Returns an array of objects containing the date and the price ratio of the two stocks that were inputted
  static async calculatePriceRatio(dataTableA, dataTableB) {
    // now we start at the top of both data tables, iterate through, and divide the closing price of each data table.
    // After we calculated the price, we add this data to an object containing the date and we put it in an array
    let currPriceRatioArray = [];
    for (let i = 0; i < dataTableA.length; i++) {
      let priceRatio = dataTableA[i].close / dataTableB[i].close;
      if (dataTableA[i].date != dataTableB[i].date) {
        console.log(chalk.bgRed("DATES ARE NOT THE SAME"));
        break;
      }
      // Add the price ratio and the date to an object and add it to the price ratio array
      currPriceRatioArray.push({
        date: dataTableA[i].date,
        priceRatio: priceRatio,
      });
    }

    console.log("Price Ratio");
    console.log(currPriceRatioArray);
    return currPriceRatioArray;
  }

  //Now we want to calculate the mean of our historical data.
  static async calculateAveragePriceRatio(priceRatioArray) {
    let totalPriceRatio = 0;
    priceRatioArray.map((currPriceRatio) => {
      totalPriceRatio = totalPriceRatio + currPriceRatio.priceRatio;
    });

    let averagePriceRatio = totalPriceRatio / priceRatioArray.length;
    return averagePriceRatio;
  }

  static async calculateStandardDeviation(averagePriceRatio, priceRatioArray) {
    let totalDifference = 0;
    priceRatioArray.map((currPriceRatio) => {
      let difference = currPriceRatio.priceRatio - averagePriceRatio;
      totalDifference = totalDifference + Math.pow(difference, 2);
    });

    // Take the square root of the sum

    let standardDeviation = Math.sqrt(
      totalDifference / (priceRatioArray.length - 1)
    );
    return standardDeviation;
  }

    //now that we have calculated our standard deviation. We need to gather alot of information and iterate through it in order to figure out when we should buy or sell
    //First we need to fetch the pairs data for 465 days in the future.
    //Then we want to loop through the data, with a 50 day window, and calculate the standard deviation for every day.
    static async calculateProfit(tickerArray, amount){
        console.log("ticker array ", tickerArray)
        this.buyingPower = amount
        this.accountValue = amount
        let stockA = tickerArray[0]
        let stockB = tickerArray[1]
        //Fetch the data for 415 day period
        await this.fetchPairsData(stockA, stockB, 450)
        //Now tht our values are set, we can do our calculations
        let currPriceRatioArray = await this.calculatePriceRatio(this.stockA, this.stockB)
        let left = 0 
        let right = 49
        
        this.priceRatioArray = currPriceRatioArray;
        //Now we loop through and calculate the standard deviation fo the designated time frame. left to right pointer and calculate the average deviation
        while(right != currPriceRatioArray.length){
            //calculate average price ratio between left and right pointers
            let currAveragePriceRatio = await this.calculateAveragePriceRatio(currPriceRatioArray.slice(left,right))
            let currStandardDeviation = await this.calculateStandardDeviation(currAveragePriceRatio, currPriceRatioArray)
           // console.log(`The currAveragePriceRatio from the dates ${currPriceRatioArray[left].date} to ${currPriceRatioArray[right].date} is ${currAveragePriceRatio}. And the standard deviation is ${currStandardDeviation}`)

            //Now that we have the standard deviation and the average price ratio, we can really eat
            // When the CURRENT PRICE RATIO is x number of standard deviations BELOW the historical mean we BUY STOCK A 
            // when the CURRENT PRICE RATIO is x number of standard deviations ABOVE the historical mean we SELL STOCK B
            // When the CURRENT PRICE RATIO reverts back to our historical mean, we SELL STOCK A  and BUY STOCK B 

            if (right == Math.round((currPriceRatioArray.length / 4))) {
        
                this.threeMonthProfit = this.accountValue 
              }
        
            if (right == Math.round(currPriceRatioArray.length / 2)) {
                this.sixMonthProfit = this.accountValue 
              }

            let currentPriceRatio = currPriceRatioArray[right].priceRatio;
            let currentDataB = this.stockB[right]
            let currentDataA = this.stockA[right]

            this.allDataArray.push({date: currPriceRatioArray[right].date, historical_mean: currAveragePriceRatio, price_ratio: currentPriceRatio,standard_deviation: currStandardDeviation})
             
            await this.determineBuyOrSell(currentPriceRatio, currAveragePriceRatio, currStandardDeviation,currentDataA,currentDataB, stockA,stockB);
            left ++ 
            right ++ 

            
        }

        console.log(chalk.bgBlue.white("TOTAL ACCOUNT VALUE  ", this.threeMonthProfit + this.accountValue, this.sixMonthProfit + this.accountValue,this.accountValue))
        console.log(this.transactionHistory)
        return this.transactionHistory
    }

    static async determineBuyOrSell(currentPriceRatio, historicalMean, standardDeviation,currentDataA,currentDataB,tickerA,tickerB) {
        let x = .59; // multiplier
        console.log("tickerA ", tickerA, " TickerB ", tickerB)
        let totalStandardDeviation = standardDeviation * x;

        if (currentPriceRatio < historicalMean - totalStandardDeviation) {
            // Buy Stock A and Sell Stock B
            await this.buyStockASellStockB(currentDataA,currentDataB,tickerA,tickerB)
        }else if (currentPriceRatio > historicalMean + totalStandardDeviation) {    
            await this.buyStockBSellStockA(currentDataA,currentDataB,tickerA,tickerB) 
  
        }
    }

    static async buyStockASellStockB(currentDataA, currentDataB, tickerA, tickerB){
        this.unfilteredTransactionHistory.push({type: "buy",ticker: tickerA, date: currentDataA.date, price: currentDataA.close });
        this.unfilteredTransactionHistory.push({type: "sell",ticker: tickerB, date: currentDataB.date, price: currentDataB.close });
    
        console.log(chalk.bgGreen("BUY STOCK A AND SELL STOCK B Buying power: ", this.buyingPower));
    
        // Buy stock A
        if(this.buyingPower >= currentDataA.close){
            this.buyingPower = this.buyingPower - currentDataA.close;
            this.stockACount += 1; // incremented with +=, not ==
    
            this.transactionHistory.push({type: "buy",ticker: tickerA, date: currentDataA.date, price: currentDataA.close });
            console.log(`Successfully bought ${tickerA} for $${currentDataA.close}`);
        } else {
            console.log(chalk.red("NOT ENOUGH MONEY TO BUY THE STOCK A"));
        }
    
        // Sell Stock B 
        if(this.stockBCount > 0){
            this.buyingPower = this.buyingPower + currentDataB.close;
            this.stockBCount -= 1;
    
            this.transactionHistory.push({type: "sell",ticker: tickerB, date: currentDataB.date, price: currentDataB.close });
            console.log(`Successfully sold ${tickerB} for $${currentDataB.close}`);
        } else {
            console.log(chalk.red("NOT ENOUGH STOCK B OWNED TO SELL"));
        }
    
        this.accountValue = this.buyingPower;
        if (this.stockACount > 0) {
          this.accountValue += this.stockACount * currentDataA.close;
        }
        if (this.stockBCount > 0) {
          this.accountValue += this.stockBCount * currentDataB.close;
        }
        console.log(`Account value is now ${this.accountValue}`);
    }
    

    static async buyStockBSellStockA(currentDataA, currentDataB, tickerA, tickerB){
        this.unfilteredTransactionHistory.push({type: "sell",ticker: tickerA, date: currentDataA.date, price: currentDataA.close });
        this.unfilteredTransactionHistory.push({type: "buy",ticker: tickerB, date: currentDataB.date, price: currentDataB.close });
        console.log(chalk.bgRed.white("BUY STOCK B AND SELL STOCK A ", this.buyingPower));
    
        // Buy stock B
        // Check the buying power to see if they have enough to buy stock B
        if(this.buyingPower >= currentDataB.close){
            this.buyingPower = this.buyingPower - currentDataB.close;
            // calculate account value
            this.stockBCount = this.stockBCount + 1;
            this.transactionHistory.push({type: "buy",ticker: tickerB, date: currentDataB.date, price: currentDataB.close });
            
            console.log(`Successfully Bought ${tickerB} for $${currentDataB.close}`);
        } else {

            console.log(chalk.red("NOT ENOUGH MONEY TO BUY THE STOCK B"));
        }
    
        // Sell Stock A
        // Check the stock quantity of Stock A to see if we have enough to sell
        if (this.stockACount > 0){
            this.buyingPower = this.buyingPower + currentDataA.close;
            this.stockACount -= 1;
            this.transactionHistory.push({type: "sell",ticker: tickerA, date: currentDataA.date, price: currentDataA.close });
            console.log(`Sold ${tickerA} for $${currentDataA.close}`);
        } else {
            console.log(chalk.red("Not enough of Stock A owned to sell"));
        }
    
        this.accountValue = this.buyingPower;
        if (this.stockACount > 0) {
          this.accountValue += this.stockACount * currentDataA.close;
        }
        if (this.stockBCount > 0) {
          this.accountValue += this.stockBCount * currentDataB.close;
        }
        console.log(`Account value is now ${this.accountValue}`);
    }
    static getAllDataArray(){
       return this.allDataArray
    }



    static getTransactionHistory(){
        return this.transactionHistory
    }
    static getAccountValue(){ 
        return[this.threeMonthProfit, this.sixMonthProfit,this.accountValue]
    }
    static getUnfilteredTransactionHistory(){
        return this.unfilteredTransactionHistory
    }
    static getPriceRatio(){
        return this.priceRatioArray
    }



}
