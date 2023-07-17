const express = require("express");
const User = require("../models/users");
const router = express.Router();
const { createUserJwt } = require("../utils/tokens");

// const security = require("../middleware/security");

// app.get("/trade/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const product = dataModel.getProdById(id);

//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404).send(`Product with id ${id} does not exist`);
//   }
// });

router.post("/login", async (req, res, next) => {
  try {
    // take the users email and password and attempt to authenticate them
    const user = await User.login(req.body);

    const token = createUserJwt(user);

    return res.status(200).json({ message: "Login Successful!", user, token });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    console.log("In register route");
    // take the user email, password
    const { acc_value, buying_power, email, firstName, lastName, password } =
      req.body;

    // console.log(firstName, email, lastName, password);

    const user = await User.register(
      acc_value,
      buying_power,
      email,
      firstName,
      lastName,
      password
    );

    const token = createUserJwt(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error("Error is: ", err);
    next(err);
  }
});

module.exports = router;
