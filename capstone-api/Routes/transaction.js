const express = require("express")
const router  = express.Router()
const Transaction = require("../models/transactions")
const Account = require("../models/accounts")
const User  = require("../models/users")
const Portfolio = require("../models/portfolios")


// Transaction.js manages all of the post and get requests from the transaction table


// Routes:
// When a stock is bought or sold, we need a POST request which will add the purchased/sold item to the table. 
// We also need a get request for bought, sold, and all transactions.


// Adds a transaction to our transaction history table. 
router.post("/add", async (req, res, next) => {
    try {
        //Access information from the req.body
        const { ticker, quantity, curr_price, user_id, trans_type } = req.body
        transaction  = await Transaction.addTransactionHistory( ticker, quantity, curr_price, user_id, trans_type)
        return res.status(201).json({transaction});
    } 
    catch (err) {
        console.error(err);
        next(err);
    }
});


// Adds a transaction to our transaction history table. 
router.get("/account/:id", async (req, res, next) => {
    try {
      const userId = req.params.id; 
  
      const account = await Account.fetchUserAccountById(userId); // Pass the exercise ID and user ID to the method

  
      return res.status(200).json({ account }); // Use 200 OK status code for a successful response
    } catch (err) {
      console.error("Error is: ", err);
      next(err);
    }
});



router.get("/portfolio/:id", async (req, res, next) => {
    try {
      const userId = req.params.id; 
  
      const user = await Portfolio.getUserPortfolio(userId); // Pass the exercise ID and user ID to the method

  
      return res.status(200).json({ user }); // Use 200 OK status code for a successful response
    } catch (err) {
      console.error("Error is: ", err);
      next(err);
    }
});


router.get("/history/:id", async (req, res, next) => {
  try {
    const userId = req.params.id; 

    const userTransactionHistory = await Transaction.getTransactionHistory(userId); // Pass the exercise ID and user ID to the method


    return res.status(200).json({ userTransactionHistory }); // Use 200 OK status code for a successful response
  } catch (err) {
    console.error("Error is: ", err);
    next(err);
  }
});


router.post("/buy", async (req, res, next) => {
    try {
        //Access information from the req.body
        const { ticker, quantity, curr_price, user_id, trans_type } = req.body
        console.log((ticker,quantity,curr_price,user_id))
        //adding purchase to our user Portfolio
        await Portfolio.buyShare(ticker, quantity, curr_price, user_id)

        await Transaction.addTransactionHistory( ticker, quantity, curr_price, user_id, trans_type)
        let portfolio = await Portfolio.getUserPortfolio(user_id)
        //checking that portfolio works
        return res.status(201).json({portfolio});

       
    } 
    catch (err) {
        console.error(err);
        next(err);
    }
});




router.post("/sell", async (req, res, next) => {
  try {
      //Access information from the req.body
      const { ticker, quantity, curr_price, user_id, trans_type } = req.body
      console.log((ticker,quantity,curr_price,user_id))
      //adding purchase to our user Portfolio
      await Portfolio.sellShare(ticker, quantity, curr_price, user_id)

      await Transaction.addTransactionHistory( ticker, quantity, curr_price, user_id, trans_type)
      let portfolio = await Portfolio.getUserPortfolio(user_id)
      //checking that portfolio works
      return res.status(201).json({portfolio});

     
  } 
  catch (err) {
      console.error(err);
      next(err);
  }
});


  



router.post("/", async (req, res, next) => {

});



module.exports = router