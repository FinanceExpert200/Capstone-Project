const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class Transaction{

    static async buyShare(ticker, quantity, curr_price, user_id, created_at, trans_type){
        // we first locate the user by their id
        // next we check if the price * quantity is greater than their buying power, If it is then we throw an error (insufficient funds)
        // if the price*quantity is less than buying power, we decrement the buying power, run updateUserPortfolio, and run addTransactionHistory

    }
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
          SELECT *
          FROM transactions
          WHERE user_id = $1 
        `;
        const result = await db.query(query, [userId]);
        const exercise = result.rows;
        return exercise;
    }
    


    static async addTransactionHistory(ticker, quantity, curr_price, user_id, trans_type) {
        try {
          console.log(`ticker ${ticker}, quantity ${quantity}, curr_price ${curr_price}, user_id ${user_id}, trans_type ${trans_type}`);
          
          const query = `
            INSERT INTO transactions (
              ticker,
              quantity,
              curr_price,
              user_id,
              trans_type
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
          `;
          
          const values = [ticker, quantity, curr_price, user_id, trans_type];
          
          const result = await db.query(query, values);
                
          return result.rows[0]
    
        
        


        } catch (err) {
          console.error(err);
        }
      }

    static async buyUserPortfolio(ticker, quantity, curr_price, user_id){
        // check if the ticker is already in the users portfolio, If it is then we increment the quantity (PUT)
        // - if it is not, we add the share to the table (POST)
    }

    static async sellShare(ticker, quantity, curr_price, user_id, created_at, trans_type){
        //Locate user by ID
        // we check that the user has enough stock to sell (quantity <= user.quantity)
        // we calculate profit 
        //------CALCULATE PROFIT------\\
        // we run sellUserPortolio
    }

    static async sellUserPortfolio(ticker, quantity, curr_price, user_id, profit){
        // check if the ticker is already in the users portfolio, If it is not we throw an error, 
        // we then decrement the quantity and update profit (PUT) 
        
    }














}
module.exports = Transaction