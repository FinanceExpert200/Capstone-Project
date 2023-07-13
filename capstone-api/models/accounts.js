const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class Accounts { 

    // Updates the buying power of a specified user, Used for when a user buys or sells a stock
    static async updateBuyingPower(amount, user_id) {
        const updateUserBuyingPowerQuery = `
        UPDATE account
        SET buying_power = $1::numeric 
        WHERE id = $2;
        `;
        
        const userValues = [amount.toString(), user_id];
        console.log(`Updating the Buying power of user ${user_id} to ${userValues}`)
        await db.query(updateUserBuyingPowerQuery, userValues);
      
    }
    //gets the users account using their user ID
    static async fetchUserAccountById(user_id){{
        const query = `
        SELECT *
        FROM account
        WHERE user_id = $1 
      `;
      const result = await db.query(query, [user_id]);
      return result.rows[0];
    }}
}
module.exports = Accounts