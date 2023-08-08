const express = require("express");
const router = express.Router();
const Transaction = require("../models/transactions");
const User = require("../models/users");
const Portfolio = require("../models/portfolios");
const Strategy = require("../models/strategy");
const yahooFinance = require("yahoo-finance2").default;
// Transaction.js manages all of the post and get requests for transactions
// Accesses the account information for a specified user (Account value and Buying power)
router.get("/account/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const account = await Portfolio.fetchUserAccountById(userId); // Pass the exercise ID and user ID to the method

    return res.status(200).json({ account }); // Use 200 OK status code for a successful response
  } catch (err) {
    console.error("Error is: ", err);
    next(err);
  }
});

router.get("/stock/:ticker", async (req, res, next) => {
  const ticker = req.params.ticker;
  console.log(ticker);
  try {
    const data = await Transaction.fetchCurrentTickerPrice(ticker);
    console.log("DATA: ", data);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// get the avgbuyprice of a stock for a user
router.get("/avgbuyprice/:ticker/:user_id", async (req, res, next) => {
  const ticker = req.params.ticker;
  const user_id = req.params.user_id;
  console.log(ticker, user_id);
  try {
    const data = await Transaction.getAvgBuyPrice(user_id, ticker);

    console.log("DATA: ", data);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err.message);
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
    console.log("THE ID", userId);
    const userTransactionHistory = await Transaction.getTransactionHistory(
      userId
    ); // Pass the exercise ID and user ID to the method
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
    const { ticker, quantity, curr_price, user_id, trans_type } = req.body;
    const transaction = await Transaction.addTransactionHistory(
      ticker,
      quantity,
      curr_price,
      user_id,
      trans_type
    );
    return res.status(201).json({ transaction });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
// Used to buy a stock (updates users portfolio, account info and transaction history with the purchased stock)
router.post("/buy", async (req, res, next) => {
  try {
    const {
      ticker,
      quantity,
      curr_price,
      user_id,
      trans_type,
      purchased_by,
      transaction_date,
    } = req.body;

    console.log(
      ticker,
      quantity,
      curr_price,
      user_id,
      trans_type,
      purchased_by
    );

    try {
      if (purchased_by != "user") {
        await Strategy.buyShare(ticker, quantity, curr_price, user_id);
        console.log(`${purchased_by} made the purchase`);
      } else {
        console.log("User made the purchase");
        await Portfolio.buyShare(ticker, quantity, curr_price, user_id);
      }
      
      // This will only run if buyShare does not throw an error
      await Transaction.addTransactionHistory(
        ticker,
        quantity,
        curr_price,
        user_id,
        trans_type,
        purchased_by,
        transaction_date
      );
    } catch (buyError) {
      console.log(buyError);
      return res.status(500).json({ error: 'There was an error buying the share' });
    }
    
    let portfolio = await Portfolio.getUserPortfolio(user_id);
    return res.status(201).json({ portfolio });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// used to sell a stock (updates portfolio, account info, and transaction history of a user when a stock is sold)
router.post("/sell", async (req, res, next) => {
  try {
    const {
      ticker,
      quantity,
      curr_price,
      user_id,
      trans_type,
      purchased_by,
      transaction_date,
    } = req.body;

    console.log(`RESULTS (sell)(${ticker},${quantity}, ${curr_price}, ${user_id})`);

    try {
      if (purchased_by != "user") {
        await Strategy.sellShare(ticker, quantity, curr_price, user_id);
      } else {
        await Portfolio.sellShare(ticker, quantity, curr_price, user_id);
      }
      
      // This will only run if sellShare does not throw an error
      await Transaction.addTransactionHistory(
        ticker,
        quantity,
        curr_price,
        user_id,
        trans_type,
        purchased_by,
        transaction_date
      );
    } catch (sellError) {
      console.log(sellError);
      return res.status(500).json({ error: 'There was an error selling the share' });
    }
    
    let portfolio = await Portfolio.getUserPortfolio(user_id);
    return res.status(201).json({ portfolio });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/historical", async (req, res, next) => {
  try {
    const { ticker, startDate, endDate } = req.body;
    console.log("TICKER", ticker, startDate, endDate);
    const query = ticker;
    const queryOptions = { period1: startDate, period2: endDate };
    const result = await yahooFinance.historical(query, queryOptions);
    return res.status(201).json({ result });
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res, next) => {});
module.exports = router;
