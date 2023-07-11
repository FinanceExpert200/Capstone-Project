const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class Transaction{

    static async buyShare(ticker, quantity, curr_price, user_id, created_at, trans_type){
        // we first locate the user by their id
        // next we check if the price * quantity is greater than their buying power, If it is then we throw an error (insufficient funds)
        // if the price*quantity is less than buying power, we decrement the buying power, run updateUserPortfolio, and run addTransactionHistory

    }


    static async addTransactionHistory(ticker, quantity, curr_price, user_id, created_at, trans_type){
        // query command to insert the transaction into our transaction table 


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