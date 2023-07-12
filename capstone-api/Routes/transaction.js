const express = require("express")
const router  = express.Router()
const Transaction = require("../models/transactions")


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
router.get("/:id", async (req, res, next) => {
    try {
      const userId = req.params.id; 
  
      const transactions = await Transaction.getTransactionHistory(userId); // Pass the exercise ID and user ID to the method
  
      return res.status(200).json({ transactions }); // Use 200 OK status code for a successful response
    } catch (err) {
      console.error("Error is: ", err);
      next(err);
    }
  });


router.post("/", async (req, res, next) => {

});




module.exports = router