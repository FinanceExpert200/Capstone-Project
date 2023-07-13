const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

<<<<<<< HEAD
class Transaction {
  // CREATE TABLE transactions (
  //     id SERIAL PRIMARY KEY,
  //     ticker TEXT NOT NULL,
  //     quantity INTEGER NOT NULL,
  //     curr_price DECIMAL NOT NULL,
  //     user_id INTEGER NOT NULL REFERENCES users(id),
  //     trans_type TEXT NOT NULL,
  //     created_at TIMESTAMP NOT NULL DEFAULT NOW())
  //     ;

  static async getTransactionHistory(userId) {
    const query = `
=======
class Transaction{
    //Function that gets the transaction history for a particular user
    static async getTransactionHistory(userId) {
        const query = `
>>>>>>> 86206bbdf2e8a03e5028197f3f9496323542d0a4
          SELECT *
          FROM transactions
          WHERE user_id = $1 
        `;
    const result = await db.query(query, [userId]);
    const exercise = result.rows;
    return exercise;
  }

<<<<<<< HEAD
  static async addTransactionHistory(
    ticker,
    quantity,
    curr_price,
    user_id,
    trans_type
  ) {
    try {
      console.log(
        `ticker ${ticker}, quantity ${quantity}, curr_price ${curr_price}, user_id ${user_id}, trans_type ${trans_type}`
      );

      const query = `
=======
    // Adds a transaction to the transaction table. Every transaction should be added here
    static async addTransactionHistory(ticker, quantity, curr_price, user_id, trans_type) {
        try {

          console.log(`Adding transaction; ticker: ${ticker}, quantity: ${quantity}, curr_price: ${curr_price}, user_id: ${user_id}, trans_type: ${trans_type}`);
          
          const query = `
>>>>>>> 86206bbdf2e8a03e5028197f3f9496323542d0a4
            INSERT INTO transactions (
              ticker,
              quantity,
              curr_price,
              user_id,
              trans_type
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
          `;
<<<<<<< HEAD

      const values = [ticker, quantity, curr_price, user_id, trans_type];

      const result = await db.query(query, values);

      return result.rows[0];
    } catch (err) {
      console.error(err);
    }
  }

  static async sellUserPortfolio(ticker, quantity, curr_price, user_id) {
    console.log("sell branch");

    const userQuery = `
          SELECT *
          FROM users
          WHERE id = $1;
        `;

    const currentUser = await db.query(userQuery, [user_id]);
    const existingBuyingPower = currentUser.rows[0].buying_power;
    const newBuyingPower = existingBuyingPower + quantity * curr_price;

    if (newBuyingPower < 0) {
      throw new Error("Insufficient funds to make transaction");
    } else {
      const updateUserBuyingPowerQuery = `
            UPDATE users
            SET buying_power = $1
            WHERE id = $2;
          `;

      const userValues = [newBuyingPower, user_id];
      await db.query(updateUserBuyingPowerQuery, userValues);

      const checkPortfolioQuery = `
            SELECT *
            FROM portfolio
            WHERE user_id = $1 AND ticker = $2;
          `;

      const values = [user_id, ticker];

      const result = await db.query(checkPortfolioQuery, values);

      if (result.rows.length === 0) {
        throw new Error(`User ${user_id} does not have that stock to sell`);
      } else {
        const existingQuantity = result.rows[0].quantity;
        const newQuantity = existingQuantity - quantity;

        if (newQuantity < 0) {
          throw new Error("Insufficient quantity to make transaction");
        } else {
          const updateItemQuery = `
                UPDATE portfolio
                SET quantity = $1
                WHERE user_id = $2 AND ticker = $3;
              `;

          const updateValues = [newQuantity, user_id, ticker];
          await db.query(updateItemQuery, updateValues);
        }
      }
    }
  }

  // static async buyUserPortfolio(ticker, quantity, curr_price, user_id) {
  //     console.log("buy branch")
  //     const userQuery = `
  //       SELECT *
  //       FROM users
  //       WHERE id = $1;
  //     `;

  //     const currentUser = await db.query(userQuery, [user_id]);
  //     const existingBuyingPower = currentUser.rows[0].buying_power;
  //     const newBuyingPower = existingBuyingPower - quantity * curr_price;

  //     if (newBuyingPower < 0) {
  //       throw new Error("Insufficient funds to make transaction");
  //     } else {
  //       const updateUserBuyingPowerQuery = `
  //         UPDATE users
  //         SET buying_power = $1
  //         WHERE id = $2;
  //       `;

  //       const userValues = [newBuyingPower, user_id];
  //       await db.query(updateUserBuyingPowerQuery, userValues);

  //       const checkPortfolioQuery = `
  //         SELECT *
  //         FROM portfolio
  //         WHERE user_id = $1 AND ticker = $2;
  //       `;

  //       const values = [user_id, ticker];

  //       const result = await db.query(checkPortfolioQuery, values);

  //       if (result.rows.length === 0) {
  //         console.log(`Item is new, adding to the portfolio for user: ${user_id}`);

  //         const addItemQuery = `
  //           INSERT INTO portfolio (
  //             ticker,
  //             quantity,
  //             user_id
  //           )
  //           VALUES ($1, $2, $3)
  //           RETURNING *;
  //         `;

  //         const addValues = [ticker, quantity, user_id];
  //         await db.query(addItemQuery, addValues);
  //       } else {
  //         const existingQuantity = result.rows[0].quantity;
  //         const newQuantity = existingQuantity + quantity;

  //         const updateItemQuery = `
  //           UPDATE portfolio
  //           SET quantity = $1
  //           WHERE user_id = $2 AND ticker = $3;
  //         `;

  //         const updateValues = [newQuantity, user_id, ticker];
  //         await db.query(updateItemQuery, updateValues);
  //       }
  //     }
  // }

  static async sellShare(
    ticker,
    quantity,
    curr_price,
    user_id,
    created_at,
    trans_type
  ) {
    //Locate user by ID
    // we check that the user has enough stock to sell (quantity <= user.quantity)
    // we calculate profit
    //------CALCULATE PROFIT------\\
    // we run sellUserPortolio
  }

  static async sellUserPortfolio(
    ticker,
    quantity,
    curr_price,
    user_id,
    profit
  ) {
    // check if the ticker is already in the users portfolio, If it is not we throw an error,
    // we then decrement the quantity and update profit (PUT)
  }
=======
          
          const values = [ticker, quantity, curr_price, user_id, trans_type];
          const result = await db.query(query, values);
          return result.rows[0];
        } catch (err) {
          console.error(err);
        }
  }

>>>>>>> 86206bbdf2e8a03e5028197f3f9496323542d0a4
}

module.exports = Transaction;
