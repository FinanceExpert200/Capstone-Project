const { use } = require("../Routes/auth");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class Accounts { 
    static async updateBuyingPower(amount, user_id) {
        const updateUserBuyingPowerQuery = `
        UPDATE account
        SET buying_power = $1::numeric 
        WHERE id = $2;
        `;
        console.log("amt: ",amount)
        const userValues = [amount, user_id];
        await db.query(updateUserBuyingPowerQuery, userValues);
      
    }
    static async fetchUserAccountById(user_id){{
        const query = `
        SELECT *
        FROM account
        WHERE user_id = $1 
      `;

      const result = await db.query(query, [user_id]);
      console.log("account result", result.rows)
      return result.rows[0];
    }}
}
module.exports = Accounts