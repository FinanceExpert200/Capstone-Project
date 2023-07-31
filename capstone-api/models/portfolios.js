const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const User = require("./users");
const Transaction = require("./transactions");

class Portfolio {
  // Gets the Users portfolio by their ID
  static async getUserPortfolio(userId) {
    const query = `
      SELECT *
      FROM portfolio
      WHERE user_id = $1 
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Adds a stock to the user's portfolio (Used when buying a new stock)
  static async addToUserPortfolio(ticker, quantity, curr_price, user_id) {
    // First, check if the stock is already in the table
    let currentPortfolio = await this.getUserPortfolio(user_id);

    if (currentPortfolio.length === 0) {
      // If it is not present in the portfolio, we need to add it to the user table
      console.log(`Item is new, adding to the portfolio for user: ${user_id}`);
      const addItemQuery = `
      INSERT INTO portfolio (
        ticker,
        quantity,
        user_id
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

      const addValues = [ticker, quantity, user_id];
      await db.query(addItemQuery, addValues);
      console.log(`Added stock to user #${user_id}'s portfolio`);
    } else {
      // If it is already present, we update the quantity
      const existingStock = currentPortfolio.find(
        (item) => item.ticker === ticker
      );
      if (existingStock) {
        const existingQuantity = existingStock.quantity;
        const newQuantity = existingQuantity + quantity;

        const updateItemQuery = `
        UPDATE portfolio
        SET quantity = $1
        WHERE user_id = $2 AND ticker = $3;
      `;

        const updateValues = [newQuantity, user_id, ticker];
        await db.query(updateItemQuery, updateValues);
        console.log(`Updated quantity of stock ${ticker} for user #${user_id}`);
      } else {
        // The stock is not present, so we add it to the user table
        console.log(
          `Item is new, adding to the portfolio for user: ${user_id}`
        );
        const addItemQuery = `
        INSERT INTO portfolio (
          ticker,
          quantity,
          user_id
        )
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

        const addValues = [ticker, quantity, user_id];
        await db.query(addItemQuery, addValues);
        console.log(`Added stock to user #${user_id}'s portfolio`);
      }
    }
  }

  // Removes a stock from the user's portfolio (Used when selling a stock)
  static async removeFromUserPortfolio(ticker, quantity, curr_price, user_id) {
    let currentPortfolio = await this.getUserPortfolio(user_id);

    if (currentPortfolio.length === 0) {
      console.log(
        `User #${user_id} does not have any stocks in their portfolio.`
      );
      return;
    }

    const existingStock = currentPortfolio.find(
      (item) => item.ticker === ticker
    );

    if (!existingStock) {
      console.log(`Stock ${ticker} is not present in the user's portfolio.`);
      return;
    }

    const existingQuantity = existingStock.quantity;

    if (quantity > existingQuantity) {
      console.log(
        `Insufficient quantity of stock ${ticker} in the user's portfolio.`
      );
      return;
    }

    const newQuantity = existingQuantity - quantity;

    if (newQuantity === 0) {
      // If the new quantity becomes zero, we remove the stock from the portfolio
      const removeItemQuery = `
      DELETE FROM portfolio
      WHERE user_id = $1 AND ticker = $2;
    `;
      const removeValues = [user_id, ticker];
      await db.query(removeItemQuery, removeValues);
    } else {
      // Otherwise, update the quantity
      const updateItemQuery = `
      UPDATE portfolio
      SET quantity = $1
      WHERE user_id = $2 AND ticker = $3;
    `;
      const updateValues = [newQuantity, user_id, ticker];
      await db.query(updateItemQuery, updateValues);
    }

    console.log(`Removed stock ${ticker} from user #${user_id}'s portfolio.`);
  }

  // Handles the purchasing of a stock by decrementing their buying power and adding the stock to the users portfolio
  static async buyShare(ticker, quantity, curr_price, user_id) {
    // Get the user info
    console.log("current user ID", user_id);
    const currentUser = await this.fetchUserAccountById(user_id);
    console.log("current user", currentUser);
    const existingBuyingPower = currentUser.buying_power;
    const newBuyingPower = existingBuyingPower - quantity * curr_price;

    console.log(newBuyingPower);
    if (newBuyingPower < 0) {
      throw new Error("Insufficient funds to make transaction");
    } else {
      // Update Buying power
      await this.updateBuyingPower(newBuyingPower.toString(), user_id);

      // Add stock to the portfolio table
      console.log(
        `Values added to portfolio: ${[ticker, quantity, curr_price, user_id]} `
      );
      await this.addToUserPortfolio(ticker, quantity, curr_price, user_id);
      await this.calculateTotalShareValue(user_id);
    }
  }

  // Handles the selling of a stock by incrementing their buying power and reducing the shares owned in the users portfolio
  static async sellShare(ticker, quantity, curr_price, user_id) {
    //get user info
    const currentUser = await this.fetchUserAccountById(user_id);
    //check if the quantity of the stock we want to sell is less than or equal to the owned user stock
    const stockQuantityOwned = await this.getShareQuantityOwned(
      user_id,
      ticker
    );
    if (quantity > stockQuantityOwned) {
      throw new Error("Trying to sell more stock than owned");
    }
    //else, update quantity and buying power
    else {
      const existingBuyingPower = currentUser.buying_power;
      const newBuyingPower =
        parseFloat(existingBuyingPower) +
        parseFloat(quantity) * parseFloat(curr_price);
      console.log("UPDATES BUYING POWER", newBuyingPower);

      this.removeFromUserPortfolio(ticker, quantity, curr_price, user_id);
      await this.updateBuyingPower(newBuyingPower.toString(), user_id);
      await this.calculateTotalShareValue(user_id);
      console.log("item changed in portfolio");
    }
  }

  //returns the quantity of the specified stock owned by a speciied user
  static async getShareQuantityOwned(user_id, ticker) {
    const checkPortfolioQuery = `
    SELECT *
    FROM portfolio
    WHERE user_id = $1 AND ticker = $2;
    `;
    const values = [user_id, ticker];
    const result = await db.query(checkPortfolioQuery, values);
    console.log(result);

    if (result.rows[0].quantity == 0) {
      throw new Error("Stock Not owned");
    } else {
      return result.rows[0].quantity;
    }
  }

  static async calculateTotalShareValue(user_id) {
    let currentUser = await this.fetchUserAccountById(user_id);

    let totalValue = parseFloat(currentUser.buying_power);

    try {
      const findTickers = `
        SELECT *
        FROM portfolio
        WHERE user_id = $1
      `;
      const val = [user_id];
      const result = await db.query(findTickers, val);

      for (const share of result.rows) {
        const quantity = share.quantity;

        // Fetch the price of the ticker
        const price = await Transaction.fetchCurrentTickerPrice(share.ticker);

        const shareValue = parseInt(quantity, 10) * parseFloat(price.c);
        console.log(
          `Total value of ${quantity} shares of ${share.ticker}: ${shareValue}`
        );
        totalValue += shareValue;
      }
    } catch (error) {
      console.error("Error calculating total share value:", error);
      throw error;
    } finally {
      console.log("Total Cash Value of Account:", totalValue);
      const userStrategy = await this.doesUserHaveStrategy(user_id)
      if(userStrategy){

        const strategyBuyingPower = userStrategy.buying_power
        
        totalValue += parseFloat(strategyBuyingPower)
        console.log("Adding strategy buying power", strategyBuyingPower," to total cash value", totalValue);
      }
      //update the Account value
      await this.updateAccountValue(totalValue, user_id);
    }
  }

  // Updates the buying power of a specified user, Used for when a user buys or sells a stock
  static async updateBuyingPower(amount, user_id) {
    const updateUserBuyingPowerQuery = `
        UPDATE account
        SET buying_power = $1::numeric 
        WHERE id = $2;
        `;
    const userValues = [amount.toString(), user_id];
    console.log(
      `Updating the Buying power of user ${user_id} to ${userValues}`
    );
    await db.query(updateUserBuyingPowerQuery, userValues);
  }
  //gets the users account using their user ID
  static async fetchUserAccountById(user_id) {
    const query = `
        SELECT *
        FROM account
        WHERE user_id = $1 
      `;
    const result = await db.query(query, [user_id]);
    return result.rows[0];
  }

  static async updateAccountValue(amount, user_id) {
    const updateUserAccountValueQuery = `
        UPDATE account
        SET  acc_value = $1::numeric 
        WHERE id = $2;
        `;
    // add the amount of stock owned to the users buying power

    const userValues = [amount.toString(), user_id];
    console.log(`Updating the Account Value of user ${user_id} to ${amount}`);
    await db.query(updateUserAccountValueQuery, userValues);
  }

  static async doesUserHaveStrategy(userId){
      try {
        const query = `SELECT * FROM tradingStrategies WHERE user_id = $1`;
        const result = await db.query(query, [userId]);
        const user = result.rows[0];
        return user
    } catch (err) {
        console.error(`Failed to get strategies for user with ID ${userId}: ${err}`);
        throw err;
    }
  }
}

module.exports = Portfolio;
