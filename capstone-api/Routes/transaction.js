const express = require("express")
const router  = express.Router()
const Transaction = require("../models/transactions")
const Account = require("../models/accounts")
const User  = require("../models/users")
const Portfolio = require("../models/portfolios")


// Transaction.js manages all of the post and get requests for transactions






// Accesses the account information for a specified user (Account value and Buying power)
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

// Access the Portfolio information for a specified user (Each stock they own and quantity)
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

// Access the transaction history of a specified user (A list of every stock they bought or sold)
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


//-----------POST REQUESTS--------------\\

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

// Used to buy a stock (updates users portfolio, account info and transaction history with the purchased stock)
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

// used to sell a stock (updates portfolio, account info, and transaction history of a user when a stock is sold)
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