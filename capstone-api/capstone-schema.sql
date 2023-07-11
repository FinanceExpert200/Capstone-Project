CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    acc_value DECIMAL NOT NULL,
    buying_power DECIMAL NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW())
    ;

--makflsh

CREATE TABLE portfolio (
    id SERIAL PRIMARY KEY,
    ticker TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW())
    ;


CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    ticker TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    curr_price DECIMAL NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW())
    trans_type TEXT NOT NULL,
    ;