const { Client } = require('pg');
const { getDatabaseUru } = require("./config");
require("colors");

const db = new Client({ connectionString: getDatabaseUru() });

db.connect((err) => {
    if (err) {
        console.error("connection error".red, err.stack);
    } else {
        console.log("Successfully connected to postgres db!".blue);
    }


});

module.exports = db;