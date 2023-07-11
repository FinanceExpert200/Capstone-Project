const express = require("express")
const router  = express.Router()
const bcrypt = require("bcrypt");
const pool = require("../db/pool");

// Transaction.js manages all of the post and get requests from the transaction table


// Routes:
// When a stock is bought or sold, we need a POST request which will add the purchased/sold item to the table. 
// We also need a get request for bought, sold, and all transactions.




module.exports = router