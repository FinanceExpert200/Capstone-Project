const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PORT } = require("./config");
const security = require("./middleware/security");
const authRoutes = require("./Routes/auth");
const transactionRoutes = require("./Routes/transaction")

const { BadRequestError, NotFoundError } = require("./utils/errors"); // Import custom error handlers

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("tiny"));

// Extract the user from the JWT. If a valid token is sent, the
// res.locals.user value will be set with the object from the token.
app.use(security.extractUserFromJwt);

app.use("/auth", authRoutes);
app.use("/trans", transactionRoutes)

// app.get("/stock")
// await yahoo("AAPL")
// res.send(result)

app.use((req, res, next) => {
  return next(new NotFoundError());
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

// const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

