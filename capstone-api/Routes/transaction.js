const express = require("express")
const router  = express.Router()


// Transaction.js manages all of the post and get requests from the transaction table


// Routes:
// When a stock is bought or sold, we need a POST request which will add the purchased/sold item to the table. 
// We also need a get request for bought, sold, and all transactions.


// Adds a transaction to our transaction history table. 
router.post("/add", async (req, res, next) => {
    try {
        //Access information from the req.body
        const { ticker, quantity, curr_price, user_id } = req.body
        console.log(` ticker ${ticker}, quantity ${quantity}, curr_price ${curr_price}, user_id ${user_id}`)
        

        

    } 
    catch (err) {
        console.error("Error in /add post route (transaction.js)");
        next(err);
    }
});



router.post("/", async (req, res, next) => {

});




module.exports = router