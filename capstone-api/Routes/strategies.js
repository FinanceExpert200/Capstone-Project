const express = require("express")
const router  = express.Router()
const Strategy = require("../models/strategy")
const User  = require("../models/users")
const Portfolio = require("../models/portfolios")

//Router post used to add a new strategy to a user or update a users strategy 
router.post("/add", async (req, res, next) => {
    try {
      //Access information from the req.body
      const { strategy_type, buying_power, user_id} = req.body
      // If the user ID is already in the table, we need to update the strategy type and the created at/last active 
      //Else, we need to insert a new entry into the data table 
      const addedStrategy = await Strategy.setStrategyToUser(strategy_type,buying_power, user_id )
      
      return res.status(201).json({addedStrategy})
    } 
    catch (err) {
        console.error(err);
        next(err);
    }
});

router.post("/active", async (req, res, next) => {
  try {

    const { date, user_id} = req.body

    const updatedLastActive = await Strategy.updateLastActive(date, user_id)

    return res.status(201).json({updatedLastActive})
  } 
  catch (err) {
      console.error(err);
      next(err);
  }
});

//We need a router to get the router information


router.get("/:id", async (req, res, next) => {
    const userId = req.params.id;
    console.log("userID")
    console.log(userId);
    try {
      const data = await Strategy.getUserStrategies(userId);
      console.log("UserStrategies: ", data);
      return res.status(200).json({ data });
    } catch (err) {
      console.log(err.message);
      next(err);
    }
});

router.delete("/remove/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        await Strategy.removeUserStrategy(userId);
        res.status(200).json({message: `Strategy for user ${userId} has been removed`});
    } catch (err) {
        console.error(err);
        next(err);
    }
});



module.exports = router

