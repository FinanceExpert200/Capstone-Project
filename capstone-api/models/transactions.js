const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const fetch = require("node-fetch");

class Transaction {
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

  static async getAvgBuyPrice(user_id, ticker) {
    const query = `
    WITH cte AS (
      SELECT
        id,
        ticker,
        quantity,
        curr_price,
        user_id,
        trans_type,
        created_at,
        purchased_by,
        SUM(CASE WHEN trans_type = 'buy' THEN curr_price * quantity ELSE -curr_price * quantity END) OVER (PARTITION BY ticker ORDER BY created_at) AS totalSum,
        SUM(CASE WHEN trans_type = 'buy' THEN quantity ELSE -quantity END) OVER (PARTITION BY ticker ORDER BY created_at) AS totalStock
      FROM
        transactions
      WHERE
        user_id = $1 -- Use placeholder for user_id
        AND ticker = $2 -- Use placeholder for ticker
    )
    SELECT
      *,
      totalSum / totalStock AS avg_buy_price -- Calculate the average buy price for each row
    FROM
      cte
    ORDER BY
      ticker, created_at;
    
    `;

    const result = await db.query(query, [user_id, ticker]); // Pass both user_id and ticker as parameters in the array
    const exercise = result.rows;
    return exercise;
  }

  // Adds a transaction to the transaction table. Every transaction should be added here
  static async addTransactionHistory(
    ticker,
    quantity,
    curr_price,
    user_id,
    trans_type,
    purchased_by,
    transaction_date
  ) {
    //if no transaction date is given, we simply dont put anythong which will automatically set date to today
    console.log("TRANSACTION DATE", transaction_date);
    if (!transaction_date) {
      try {
        console.log(
          `Adding transaction; ticker: ${ticker}, quantity: ${quantity}, curr_price: ${curr_price}, user_id: ${user_id}, trans_type: ${trans_type}, purchased_by ${purchased_by}`
        );
        const query = `
        INSERT INTO transactions (
            ticker,
            quantity,
            curr_price,
            user_id,
            trans_type,
            purchased_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
        const values = [
          ticker,
          quantity,
          curr_price,
          user_id,
          trans_type,
          purchased_by,
        ];
        const result = await db.query(query, values);
        return result.rows[0];
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(
        `Adding transaction; ticker: ${ticker}, quantity: ${quantity}, curr_price: ${curr_price}, user_id: ${user_id}, trans_type: ${trans_type}, purchased_by ${purchased_by} DATE (Strategy transaction) ${transaction_date}`
      );
      try {
        const query = `
          INSERT INTO transactions (
            ticker,
            quantity,
            curr_price,
            user_id,
            trans_type,
            purchased_by,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5,$6,$7)
          RETURNING *;
        `;
        const values = [
          ticker,
          quantity,
          curr_price,
          user_id,
          trans_type,
          purchased_by,
          transaction_date,
        ];
        const result = await db.query(query, values);
        return result.rows[0];
      } catch (err) {
        console.error(err);
      }
    }
  }
  static async fetchCurrentTickerPrice(ticker) {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cio7if1r01qhd71bpk70cio7if1r01qhd71bpk7g`
      );
      const data = await response.json();
      console.log("Current price: of ", ticker, data.c);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
module.exports = Transaction;
