const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class Transaction{
    //Function that gets the transaction history for a particular user
    static async getTransactionHistory(userId) {
        const query = `
          SELECT *
          FROM transactions
          WHERE user_id = $1 
        `;
        const result = await db.query(query, [userId]);
        const exercise = result.rows;
        return exercise;
    }

    // Adds a transaction to the transaction table. Every transaction should be added here
    static async addTransactionHistory(ticker, quantity, curr_price, user_id, trans_type) {
        try {

          console.log(`Adding transaction; ticker: ${ticker}, quantity: ${quantity}, curr_price: ${curr_price}, user_id: ${user_id}, trans_type: ${trans_type}`);
          
          const query = `
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
          
          const values = [ticker, quantity, curr_price, user_id, trans_type];
          const result = await db.query(query, values);
          return result.rows[0];
        } catch (err) {
          console.error(err);
        }
  }

}


module.exports = Transaction