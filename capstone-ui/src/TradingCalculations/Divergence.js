import Utilities from "./Utilities";
import chalk from "chalk";

export default class  Divergence{
    static buyingPower = 0 
    static accountValue =  0
    static stocksOwned = 0
    static threeMonthProfit = 0
    static SixMonthProfit = 0 
    static transactionHistory = []
    static totalAccountValue = 0
    static totalThreeMonthProfit = 0 
    static totalSixMonthProfit = 0 
    static RSIArray = []
    static returnedArray = [0,0,0]





    // First we need to calculate the RSI for all data for a year
    //To do that we can start by calculating the daily price changes
    // 1. pull historical data 
    // Loop through and compare the current day to the previous day

    //Calculating the RSI for a specific company
    static async calculateRSI(ticker){
        //fetch historicalData from a  year prior
        let yearPrior = Utilities.getDatePrior(445)
        let tickerHistoricalData = await Utilities.fetchHistoricalData(ticker,yearPrior)
        let RSIArray = []
        let dailyPriceChange = []
        for (let i = 1; i< tickerHistoricalData.length; i ++ ){
            let priceChange = tickerHistoricalData[i].close -  tickerHistoricalData[i-1].close
            dailyPriceChange.push({date: tickerHistoricalData[i].date, priceChange:  priceChange })
        }
        //Now that we have the daily price change we can start calculating the average gains and losses. We want to loop through with 2 pointers (right starting 14 days ahead) and calculate the average gain and loss in the time period
        let left = 0 
        let right = 20
        //Loops through our DailyPriceCHange array and calculates the RSI for every day
        for(right; right < dailyPriceChange.length; right++){
            let averages = await this.calculateAverageGainAndLoss(dailyPriceChange.slice(left, right))
            let currRelativeStrength = averages.averageGain/averages.averageLoss
            let RSI = 100-(100/(1+currRelativeStrength))
            RSIArray.push({date: dailyPriceChange[right].date, RSI: RSI})
            this.RSIArray.push({date: dailyPriceChange[right].date, RSI: RSI})
            left ++
        }
        await this.determineDivergence(RSIArray, dailyPriceChange, ticker)
    }

    //Calculates the average gains and losses in a specific time frame, used when calculating the RSI 
    static async calculateAverageGainAndLoss(dataInTimeFrame){
        //loop through and calculate average Gains and losses
        let averageGain = 0 
        let averageLoss = 0 
        for(let i = 0; i< dataInTimeFrame.length; i++ ){
            if(dataInTimeFrame[i].priceChange > 0){
                averageGain += dataInTimeFrame[i].priceChange
            }
            if(dataInTimeFrame[i].priceChange < 0){
                averageLoss += Math.abs(dataInTimeFrame[i].priceChange) 
            }
        }
        //Returns an object of the average gaina nd loss for the specific time frame
        return {averageGain: averageGain/14, averageLoss: averageLoss/14}
    }

    //Now we can use our RSI array and our dailyPriceChange array to determine whether or not we want to trade
    static async determineDivergence(RSIArray, dailyPriceChangeArray, ticker){
        let left = 1
        let right = 21
        let currentMarketData = await Utilities.fetchHistoricalData(ticker, RSIArray[0].date)
        let threeMonthProfit = 0 
        let sixMonthProfit = 0 
        let yearProfit = 0 

        for(right; right < dailyPriceChangeArray.length; right++){
            //Bullish Divergence
            // When the current Price is lower than the previous price (the priceCHange is negative), AND the Current RSI is greater than the previous RSI we want to buy the stock
            let RSIChange = RSIArray[left].RSI - RSIArray[left -1].RSI  
            let currPriceChange = dailyPriceChangeArray[right].priceChange
            if( currPriceChange < 0 && RSIChange > 0){
                this.buyStock(ticker,currentMarketData[left] )
            }
            if( currPriceChange > 0 && RSIChange < 0){
                this.sellStock(ticker,currentMarketData[left] )
            }
            // Save the data from the three month and six month mark 
            if (right == Math.round((dailyPriceChangeArray.length / 4) * 3)){
                console.log("three month mark reached, total account value is ", this.accountValue)
                threeMonthProfit = this.accountValue
            }
            if(right == Math.round(dailyPriceChangeArray.length/ 2 )){
                console.log("six month mark reached, total account value is ", this.accountValue)
                sixMonthProfit = this.accountValue
            }
            left ++ 
        }   
        yearProfit = this.accountValue
        //after our strategy has finished running for our individual ticker, we add the strategy to a running total of all the profit we made from this strategy for each ticker
        console.log(`Total Account value over a year: ${yearProfit} 3 months: ${threeMonthProfit}, 6 Months ${sixMonthProfit}`)
        await this.addToTotal([threeMonthProfit,sixMonthProfit,yearProfit])
        return this.transactionHistory
    }

    static buyStock(ticker, stock){
        //If We dont have enough buying power to purchase the stock, we display a mesage and continue
        if(stock.close > this.buyingPower){
            // console.log(chalk.bgRed("CANNOT PURCHASE STOCK, INSUFFICIENT BUYING POWER"))
        }
        if(stock.close <= this.buyingPower){
            //If we do have sufficient funds, we decrement our buying power and we increment the amount of stocks owned one
            // We also add the transaction to our transactionHistory
            this.buyingPower -= stock.close
            this.stocksOwned += 1 
            this.transactionHistory.push({type: "buy", ticker: ticker, date: stock.date, price: stock.close})
            // console.log(chalk.bgBlack.white(`${ticker} Stock purchased for ${stock.close} on ${stock.date}`))
        }
        this.accountValue  = this.buyingPower + (this.stocksOwned * stock.close)
    }

    static sellStock(ticker, stock){
        if(this.stocksOwned === 0){
            //Check if we have enough stock owned to sell
            // console.log(chalk.bgRed("We dont have any stock to sell"))
        }
        else{
            // If we do then we decrement the amount owned and add the trade to our transaction history
            this.stocksOwned -= 1
            this.buyingPower += stock.close
            this.transactionHistory.push({type: "sell", ticker: ticker, date: stock.date, price: stock.close})
            console.log(chalk.bgYellow(`${ticker} Stock sold for ${stock.close} on ${stock.date}`))
        }
        this.accountValue  = this.buyingPower + (this.stocksOwned * stock.close)
    }

    static async calculateDisplayedProfit(amount, tickerArray){
        //This function is used to pass in the amount of stocks we want to trade with, this is then iterated through and the algorithm calculates the total profit for all 
        // of the stocks given. Then the algorithm returnsthe transaction History with the total profit for 3 months, 6 months, and 1 year
        let tickerBudget = amount/tickerArray.length
        console.log("ticker array: ", tickerArray)
        // an array of tickers, we loop through this array and we run our strategy for each ticker in the array 
        for (let i = 0; i < tickerArray.length; i++) {
            console.log(`--- Start Processing ${tickerArray[i]} ---`)
            this.setBuyingPowerAndAccountValue(tickerBudget)
            await this.calculateRSI(tickerArray[i]);
            console.log(`--- Finished Processing ${tickerArray[i]} ---`)
        }
    
        console.log(`--- Finished Processing All Tickers ---`)
        console.log(chalk.red(`TOTAL ${this.totalAccountValue}, 3 months ${this.totalThreeMonthProfit}, 6 months ${this.totalSixMonthProfit}`));
        console.log(this.transactionHistory)
        let profitArray = [this.totalThreeMonthProfit,this.totalSixMonthProfit,this.totalAccountValue]
    
        return [this.transactionHistory, profitArray]
    }




    static setBuyingPowerAndAccountValue(amount){
        console.log("buying power and account value set to ", amount)
        this.buyingPower = amount
        this.accountValue = amount
    }
    static getBuyingPower(){
        return this.buyingPower
    }
    static getAccountValue(){
        return this.returnedArray
    }
    static  async setAccountValue(threemonth, sixmonth,oneyear){
        console.log("setting account value", )    
        this.returnedArray[0] = threemonth
        this.returnedArray[1] = sixmonth
        this.returnedArray[2] = oneyear
        console.log("returned array is now", this.returnedArray)
    }
    static getTransactionHistory(){
        return this.transactionHistory
    }


    static async addToTotal(profits){
        console.log("profits", profits)
        if(profits[0] != 0 && profits[1] != 0 && profits[2] != 0 ){
            this.totalThreeMonthProfit = this.totalThreeMonthProfit+ profits[0]
            this.totalSixMonthProfit = this.totalSixMonthProfit+  profits[1]
            this.totalAccountValue = this.totalAccountValue+ profits[2]
            console.log(chalk.bgBlue.white(`adding ${profits[2]} to our total, new total is ${this.totalThreeMonthProfit} ,${this.totalSixMonthProfit}  ${this.totalAccountValue} typeinsearch`))
            await this.setAccountValue(this.totalThreeMonthProfit,this.totalSixMonthProfit,this.totalAccountValue)
        }
    }
    static async getRSIData(){
        return this.RSIArray
    }
}