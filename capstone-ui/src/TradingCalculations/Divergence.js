import Utilities from "./Utilities";
import chalk from "chalk";

export default class  Divergence{
    static buyingPower = 5000
    static accountValue = 5000
    static stocksOwned = 0
    // First we need to calculate the RSI for all data for a year
    //To do that we can start by calculating the daily price changes
    // 1. pull historical data 
    // Loop through and compare the current day to the previous day
    static async calculateRSI(ticker){
        //fetch istoricalData from a  year prior
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
        for(right; right < dailyPriceChange.length; right++){
            let averages = await this.calculateAverageGainAndLoss(dailyPriceChange.slice(left, right))
            console.log(`Average Gain ${averages.averageGain} Average Loss ${averages.averageLoss} Average ${averages.averageGain/averages.averageLoss} `)
            let currRelativeStrength = averages.averageGain/averages.averageLoss
            //Now we just need to calculate the RSI
            let RSI = 100-(100/(1+currRelativeStrength))
            RSIArray.push({date: dailyPriceChange[right].date, RSI: RSI})
            left ++
        }

        this.determineDivergence(RSIArray, dailyPriceChange, ticker)
        
    }

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
        return {averageGain: averageGain/14, averageLoss: averageLoss/14}
    }

    //Now we can use our RSI array and our dailyPriceChange array to determine whether or not we want to trade
    static async determineDivergence(RSIArray, dailyPriceChangeArray, ticker){
        console.log(dailyPriceChangeArray)
        console.log(RSIArray)

        let left = 1
        let right = 21

        let currentMarketData = await Utilities.fetchHistoricalData(ticker, RSIArray[0].date)
        console.log(currentMarketData)
        console.log("====================----------------------============================")

        


        for(right; right < dailyPriceChangeArray.length; right++){
            //Bullish Divergence
            // When the current Price is lower than the previous price (the priceCHange is negative), AND the Current RSI is greater than the previous RSI we want to buy the stock
            let RSIChange = RSIArray[left].RSI - RSIArray[left -1].RSI  
            let currPriceChange = dailyPriceChangeArray[right].priceChange
            console.log(`Current RSIChange ${RSIChange} On ${RSIArray[left].date} Current priceChange ${dailyPriceChangeArray[right].priceChange} On ${dailyPriceChangeArray[right].date} Market data ${currentMarketData[left].close}, ${currentMarketData[left].date}` )
            if( currPriceChange < 0 && RSIChange > 0){
                this.buyStock(ticker,currentMarketData[left] )
            }
            if( currPriceChange > 0 && RSIChange < 0){
                this.sellStock(ticker,currentMarketData[left] )
            }
            left ++ 
        }   
        console.log(`Total Account value: ${this.accountValue}`)

    }

    static buyStock(ticker, stock){
        if(stock.close > this.buyingPower){
            console.log(chalk.bgRed("CANNOT PURCHASE STOCK, INSUFFICIENT BUYING POWER"))
        }
        if(stock.close <= this.buyingPower){
            this.buyingPower -= stock.close
            this.stocksOwned += 1 
            console.log(chalk.bgBlack.white(`${ticker} Stock purchased for ${stock.close} on ${stock.date}`))
        }
        this.accountValue  = this.buyingPower + (this.stocksOwned * stock.close)

    }
    static sellStock(ticker, stock){
        if(this.stocksOwned === 0){
            console.log(chalk.bgRed("We dont have any stock to sell"))
        }
        else{
            this.stocksOwned -= 1
            this.buyingPower += stock.close
            console.log(chalk.bgYellow(`${ticker} Stock sold for ${stock.close} on ${stock.date}`))
        }
        this.accountValue  = this.buyingPower + (this.stocksOwned * stock.close)
    }


    static async calculateProfit(amount){
        let totalProfit = 0 
        individualStock = amount/5
        this.buyingPower = individualStock
        let amazonProfit = await this.calculateRSI("AMZN")
    }
    


}