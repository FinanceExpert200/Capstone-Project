const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const User = require("./users")
const Account = require("./accounts")

class Portfolio {
  static async getUserPortfolio(userId) {
    const query = `
      SELECT *
      FROM portfolio
      WHERE user_id = $1 
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async addToUserPortfolio(ticker, quantity, curr_price, user_id) {
    // First check if the stock is already in the table
    let currentPortfolio = await this.getUserPortfolio(user_id);
    

    // if it is not present in the portfolio, we need to add it to the user table
    if (currentPortfolio.length  == 0 ) {
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
    } else {
      // if not, we update the quantity

      const existingQuantity = currentPortfolio[0].quantity;
      const newQuantity = existingQuantity + quantity;

      const updateItemQuery = `
        UPDATE portfolio
        SET quantity = $1
        WHERE user_id = $2 AND ticker = $3;
      `;

      const updateValues = [newQuantity, user_id, ticker];
      await db.query(updateItemQuery, updateValues);
    }
  }

  static async removeFromUserPortfolio(ticker, quantity, curr_price, user_id){
    let currentPortfolio = await this.getUserPortfolio(user_id);
    const existingQuantity = currentPortfolio[0].quantity;
    const newQuantity = existingQuantity - quantity;

    const updateItemQuery = `
      UPDATE portfolio
      SET quantity = $1
      WHERE user_id = $2 AND ticker = $3;
    `;

    const updateValues = [newQuantity, user_id, ticker];
    await db.query(updateItemQuery, updateValues);
  }

  static async buyShare(ticker, quantity, curr_price, user_id) {
    // Get the user info
    const currentUser = await Account.fetchUserAccountById(user_id);
    console.log( "current user", currentUser)
    const existingBuyingPower = currentUser.buying_power;
    
    const newBuyingPower = existingBuyingPower - quantity * curr_price;
    console.log(newBuyingPower)
    if (newBuyingPower < 0) {
      throw new Error("Insufficient funds to make transaction");
    } else {
      // Update Buying power
      await Account.updateBuyingPower(newBuyingPower.toString(), user_id);
      // Add stock to the portfolio table
      console.log(`Values added to portfolio: ${[ticker, quantity, curr_price, user_id]} `)
      await this.addToUserPortfolio(ticker, quantity, curr_price, user_id);
    }
  }

  static async sellShare(ticker, quantity, curr_price, user_id) {
    //get user info

    const currentUser = await Account.fetchUserAccountById(user_id);
    //check if the quantity of the stock we want to sell is less than or equal to the owned user stock
    const stockQuantityOwned = await this.getShareQuantityOwned(user_id, ticker)
    if(quantity > stockQuantityOwned){
      throw new Error("Trying to sell more stock than owned")
    }
    //else, update quantity
    else{
      this.removeFromUserPortfolio(ticker, quantity, curr_price, user_id)
      console.log("item changed in portfolio")
    }
  }

  //returns the quntity of the specified stock owned by a speciied user
  static async getShareQuantityOwned(user_id, ticker){
    const checkPortfolioQuery = `
    SELECT *
    FROM portfolio
    WHERE user_id = $1 AND ticker = $2;
    `;

    const values = [user_id, ticker];
    const result = await db.query(checkPortfolioQuery, values);
    console.log(result)

    if(result.rows[0].quantity == 0 ){
      throw new Error("Stock Not owned")
    }
    else{
      return result.rows[0].quantity
    }
  }
}

module.exports = Portfolio;