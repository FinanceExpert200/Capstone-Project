import Utilities from "./Utilities";
import chalk from "chalk"

export default class PairsTrading{
    static stockA = {}
    static stockB = {}
    static totalTrades = 0 
    static stockACount = 0 
    static stockBCount = 0 
    static buyingPower = 0
    static accountValue = 0 



    //For this strategy, we need to take in two comanies which can be mixed and matched by the user. 
    // ---------- Implementation ---------------\\
    // 1. Data Retrieval - Fetch the given comapnies from the api in utilities and store them to static variables since we will need them throughout the entirety of our class
    //      - Gather data for a year right now, we might increase that time period later
    // 2. Calculate the Price Ratio - Now we need to get the price ratio by dividing the price of one asset by the other asset
    // 3. Calculate the Mean and Standard Deviation
    static async fetchPairsData(stockA, stockB, datePrior){
        //Calclate the date a year prior to today
        let dayPrior = await Utilities.getDatePrior(datePrior)
        // Now we use the yearPrior Date to fetch our data
        this.stockA = await Utilities.fetchHistoricalData(stockA, dayPrior)
        this.stockB = await Utilities.fetchHistoricalData(stockB,dayPrior)
        console.log(`Stock A and Stock B Calculated`)
        this.calculatePriceRatio(this.stockA, this.stockB)
    }

    // Returns an array of objects containing the date and the price ratio of the two stocks that were inputted
    static async calculatePriceRatio(dataTableA, dataTableB){
        // now we start at the top of both data tables, iterate through, and divide the closing price of each data table. 
        // After we calculated the price, we add this data to an object containing the date and we put it in an array
        let currPriceRatioArray = []
        for(let i = 0; i < dataTableA.length; i++){
            let priceRatio = dataTableA[i].close / dataTableB[i].close
            if(dataTableA[i].date !=dataTableB[i].date ){
                console.log(chalk.bgRed("DATES ARE NOT THE SAME"))
                break
            }
            // Add the price ratio and the date to an object and add it to the price ratio array
            currPriceRatioArray.push({date: dataTableA[i].date, priceRatio: priceRatio})
        }

        console.log("Price Ratio")
        console.log(currPriceRatioArray)
        return currPriceRatioArray
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
        
        let standardDeviation = Math.sqrt(totalDifference / (priceRatioArray.length - 1));
        return standardDeviation;
    }

    //now that we have calculated our standard deviation. We need to gather alot of information and iterate through it in order to figure out when we should buy or sell
    //First we need to fetch the pairs data for 465 days in the future.
    //Then we want to loop through the data, with a 50 day window, and calculate the standard deviation for every day.
    static async calculateProfit(stockA, stockB){
        //Fetch the data for 415 day period
        await this.fetchPairsData(stockA, stockB, 450)
        //Now tht our values are set, we can do our calculations
        let currPriceRatioArray = await this.calculatePriceRatio(this.stockA, this.stockB)
        let left = 0 
        let right = 49
        
        //Now we loop through and calculate the standard deviation fo the designated time frame. left to right pointer and calculate the average deviation
        while(right != currPriceRatioArray.length){
            //calculate average price ratio between left and right pointers
            let currAveragePriceRatio = await this.calculateAveragePriceRatio(currPriceRatioArray.slice(left,right))
            let currStandardDeviation = await this.calculateStandardDeviation(currAveragePriceRatio, currPriceRatioArray)
            console.log(`The currAveragePriceRatio from the dates ${currPriceRatioArray[left].date} to ${currPriceRatioArray[right].date} is ${currAveragePriceRatio}. And the standard deviation is ${currStandardDeviation}`)
            //Now that we have the standard deviation and the average price ratio, we can really eat
            // When the CURRENT PRICE RATIO is x number of standard deviations BELOW the historical mean we BUY STOCK A 
            // when the CURRENT PRICE RATIO is x number of standard deviations ABOVE the historical mean we SELL STOCK B
            // When the CURRENT PRICE RATIO reverts back to our historical mean, we SELL STOCK A  and BUY STOCK B 
            let currentPriceRatio = currPriceRatioArray[right].priceRatio;
            await this.determineBuyOrSell(currentPriceRatio, currAveragePriceRatio, currStandardDeviation);
            left ++ 
            right ++ 

            
        }

        console.log(chalk.bgBlue.white("TOTAL TRADES ", this.totalTrades))
        
    }

    static async determineBuyOrSell(currentPriceRatio, historicalMean, standardDeviation) {
        let x = .59; // multiplier
        let totalStandardDeviation = standardDeviation * x;
        if (currentPriceRatio < historicalMean - totalStandardDeviation) {
            // Buy Stock A and Sell Stock B
            console.log(chalk.bgGreen("BUY STOCK A AND SELL STOCK B"));
            this.stockACount += 1 
            // Call a function or perform actions to execute the buy and sell trade
            // For example: executeBuyStockAAndSellStockB();
        } else if (currentPriceRatio > historicalMean + totalStandardDeviation) {
            // Sell Stock A and Buy Stock B
            console.log(chalk.bgRed("BUY STOCK A AND SELL STOCK B"));
            this.totalTrades +=1
            // Call a function or perform actions to execute the buy and sell trade
            // For example: executeSellStockAAndBuyStockB();
        }
        
    }

    static async buyStockASellStockB(stockAPrice, stockBPrice){
        //Buy
        //Check the buying power to see if they have enough to buy stock A 
        if(this.buyingPower >= this.stockAPrice){
            
            this.buyingPower = this.buyingPower - this.stockAPrice
            //calculate account value
            this.stockACount = this.stockACount + 1
            this.accountValue = this.buyingPower + (this.stockACount * stockAPrice)

            console.log(`StockA has been purchased for ${stockAPrice}$, remaining buying power: ${this.buyingPower} and the account value is ${this.accountValue}`)
        }
        //Sell
    
    }










}