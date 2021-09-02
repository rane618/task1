const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = (req, res) => {
  const { username, password ,confirmpassword} = req.body;

  if (!username || !password || !confirmpassword) {
    res.send( 'Please enter all fields' );
  }

  if (password != confirmpassword) {
    res.send( 'Passwords do not match' );
  }

  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
      if (err) throw err;

      const db = client.db(process.env.DB_NAME);
      const query = { username };

      //Check whether the username is unique or already exists in the database
      const registeredUsersWithSameUsername = await db
        .collection("users")
        .find(query)
        .toArray();
      const userNameIsUnique = !registeredUsersWithSameUsername.length;

      if (userNameIsUnique) {
        //add the user to database
        db.collection("users").insertOne(
          {
            username,
            password: await bcrypt.hash(password, 10),
            confirmpassword: await bcrypt.hash(confirmpassword, 10),
           
          },
          (err, result) => {
            if (err) throw err;
            res.json({
              success: true,
              message: "User Registered Successfully!",
            });
          }
        );
      } else {
        //username is already registered
        res.json({
          success: false,
          message:
            "Username already registered. Try a different userName",
        });
      }
      setTimeout(() => client.close(), 10);
    }
  );
};