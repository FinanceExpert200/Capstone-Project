const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const Portfolio = require("./portfolios");



class Strategy{
    
    static async setStrategyToUser(strategyName, buyingPower, userId) {
        // Check if the user already has a strategy
        const user  = await this.getUserStrategies(userId);
        if (user) {
            // If the user already has a strategy, throw an error
            throw new BadRequestError(`Remove your current strategy before selecting a new one`);
        }
        else {
            // Fetch the current buying power from the account table
            const query = `SELECT buying_power FROM account WHERE user_id = $1`;
            const result = await db.query(query, [userId]);
            
            // Access the actual buying power value
            const currentBuyingPower = result.rows[0].buying_power;
    
            // Calculate the new buying power
            const newBuyingPower = parseFloat(currentBuyingPower) - parseFloat(buyingPower);
            
            // Check if newBuyingPower is negative which means user doesn't have enough buying power
            if(newBuyingPower < 0) {
                throw new BadRequestError(`User doesn't have enough buying power`);
            }
        
            console.log("NEW BUYING POWER ", newBuyingPower)
            "NEW BUYING POWER FOR THE USER "
            // Update the buying power in the account table
            await Portfolio.updateBuyingPower(newBuyingPower, userId);

            console.log("updated the Users buying power");
    
            // Insert the new strategy into the tradingStrategies table
            const strategyResult = await db.query(
                `INSERT INTO tradingStrategies (
                    strategy_name,
                    user_id,
                    buying_power
                    )
                    VALUES ($1, $2, $3)
                    RETURNING *
                    `,
                [
                    strategyName,
                    userId,
                    buyingPower
                ]
            );
            console.log(`Successfully Added new strategy ${strategyName} to user # ${userId}`);
            return strategyResult.rows[0];
        }
    }
    
    static async getUserStrategies(userId) {
        try {
            const query = `SELECT * FROM tradingStrategies WHERE user_id = $1`;
            const result = await db.query(query, [userId]);
            const user = result.rows[0];
            if (!user) {
                console.log("No strategies found for user with ID:", userId);
                return null;
            }
            console.log(user);
            return user;
        } catch (err) {
            console.error(`Failed to get strategies for user with ID ${userId}: ${err}`);
            throw err;
        }
    }

    static async removeUserStrategy(userId) {
        // Fetch the strategy details first
        const strategy = await this.getUserStrategies(userId);
        if (!strategy) {
            throw new BadRequestError(`No strategy found for user ${userId}`);
        }
    
        // Then delete the strategy
        const deleteResult = await db.query(
            `DELETE FROM tradingStrategies WHERE user_id = $1`,
            [userId]
        );
    
        if (deleteResult.rowCount === 0) {
            throw new BadRequestError(`No strategy found for user ${userId}`);
        }
    
        // Fetch the current buying power
        const query = `SELECT buying_power FROM account WHERE user_id = $1`;
        const result = await db.query(query, [userId]);
        const currentBuyingPower = result.rows[0].buying_power;
        console.log(`current Buying Power = ${currentBuyingPower}`)
        // Add back the strategy's buying power
        const newBuyingPower = parseFloat(currentBuyingPower) + parseFloat(strategy.buying_power);
        await Portfolio.updateBuyingPower(newBuyingPower, userId);
       
        console.log(`Successfully removed strategy for user # ${userId}`)
    }

    static async buyShare(ticker, quantity, currPrice, userId){
        const currentBuyingPower = await this.getStrategyBuyingPower(userId)
        const totalStockValue = Number.parseFloat(currPrice) * quantity

        if(Number.parseFloat(currentBuyingPower) > totalStockValue){
            console.log("updated Buying Power " , totalStockValue , quantity, currentBuyingPower)
            const newBuyingPower = Number.parseFloat(currentBuyingPower) - totalStockValue
            await this.updateBuyingPower(newBuyingPower.toString(), userId)
            await Portfolio.addToUserPortfolio(ticker, quantity, currPrice, userId)
        }
        else{
            throw new Error("Insufficient Funds to buy stock")
        }
        
        
    }

    static async sellShare(ticker, quantity, currPrice, userId){
        // Fetch the users portfolio so we can check if they have enough stock quantity to sell
        const currentUser = await Portfolio.fetchUserAccountById(userId)
        console.log("sellshare in strat")
        const stockQuantityOwned = await Portfolio.getShareQuantityOwned(userId, ticker)
        if(quantity > stockQuantityOwned) { 
            throw new Error("Not enough stock owned to sell")
        }
        else{
            //fetch strategies buying power 
            const existingBuyingPower = await this.getStrategyBuyingPower(userId)
            // calculate New buying power
            const newBuyingPower = parseFloat(existingBuyingPower) + parseFloat(quantity) * parseFloat(currPrice);
            //remove the share from the users portfolio
            await Portfolio.removeFromUserPortfolio(ticker, quantity, currPrice, userId)
            //update buying power for strategy
            await this.updateBuyingPower(newBuyingPower.toString(), userId)
            console.log(`Updating Buying power to ${newBuyingPower}`)
            

        }
    }


    static async getStrategyBuyingPower(userId){
        const strategy = await this.getUserStrategies(userId)
        return strategy.buying_power
    }

    static async updateLastActive(date, userId){
        const updateUserBuyingPowerQuery = `
        UPDATE tradingStrategies
        SET last_active = $1
        WHERE user_id = $2;
        `;
        const userValues = [date, userId];
        console.log(
          `Updating the Date of STRATEGY user ${userId} to ${userId}`
        );
        const result = await db.query(updateUserBuyingPowerQuery, userValues);
        return result
    }



    static async updateBuyingPower(amount, userID) {
        const updateUserBuyingPowerQuery = `
            UPDATE tradingStrategies
            SET buying_power = $1::numeric 
            WHERE user_id = $2;
            `;
        const userValues = [amount.toString(), userID];
        console.log(
          `Updating the Buying power of STRATEGY user ${userID} to ${amount.toString()}`
        );
        await db.query(updateUserBuyingPowerQuery, userValues);
      }
}
module.exports = Strategy