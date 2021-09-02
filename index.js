const express = require("express");
const chalk = require("chalk");
const path = require("path");
require("dotenv").config();
require('./db/conn');

const registerController = require("./controllers/register");
const loginController = require("./controllers/login");

//use routing for requests for users routes
const usersRoute = require("./routes/users");

const app = express();
//use users route for such request
app.use("/users", usersRoute);

//use json
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));;

app.post("/register", registerController);
app.post("/login", loginController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(chalk.blueBright(`SERVER STARTED ON PORT ${PORT}`))
);