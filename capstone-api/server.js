const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PORT } = require("./config");
const security = require("./middleware/security");
const authRoutes = require("./Routes/auth");
const transactionRoutes = require("./Routes/transaction");
const strategyRoutes = require("./Routes/strategies");

// const transactionRoutes = require("./Routes/transaction")

const { BadRequestError, NotFoundError } = require("./utils/errors"); // Import custom error handlers

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = [
    "https://stock-swap.onrender.com",
    "https://stock-swap.onrender.com",
    "https://capstone-project-6ssi.onrender.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

// app.use(cors());

app.use(express.json());

app.use(morgan("tiny"));

// Extract the user from the JWT. If a valid token is sent, the
// res.locals.user value will be set with the object from the token.
app.use(security.extractUserFromJwt);

app.use("/auth", authRoutes);
app.use("/trans", transactionRoutes);
app.use("/strategy", strategyRoutes);

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
