// DB, Schema and Models => mongoose
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const PORT = "7777";
const app = express();

app.post("/signup", async (req, res) => {
    try {
        const userObj = {
            firstName: "Harsh",
            lastName: "Kaira",
            age: 25,
            email: "harsh12345@gmail.com",
            password: "harsh@1234"
        };

        const user = new User(userObj);
        await user.save();

        res.send("User added Successfully!");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error saving user");
    }
});


connectDB().then(() => {
  console.log("DB is connected successfully");
    app.listen(PORT, ()=> {
     console.log(`Server is runnning on port ${PORT}`)
    });
}).catch((err) => {
  console.error('DB connection error:', err);
});

