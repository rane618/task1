const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res) => {
  const { username, password } = req.body;

  MongoClient.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (err, client) => {
      if (err) throw err;
      const db = client.db("register");
      const query = { username };

      //get users with the email the user entered
      const user = await db.collection("users").findOne(query);

      //if the username doesn't exist
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      } else {
        //the user exists
        const correctPassword = await bcrypt.compare(password, user.password);
        client.close();
        //if the password is incorrect
        if (!correctPassword) {
          {
            return res.status(401).json({
              success: false,
              message: "Incorrect Password",
            });
          }
        } else {
          // if the password is correct
          //sign a token
          const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "1h",
            }
          );

          //save the token and user id in cookie
          res.cookie("token", token, { path: "/" });
          res.cookie("id", user._id, { path: "/" });
          return res.json({
            success: true,
            message: `You login as ${user.username} and Your token is ${token}`,
           
          });
        }
      }
    }
  );
};