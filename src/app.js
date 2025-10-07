//Episode-11 - Diving into the APIs and express Router

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt")
const {validateSignUpData} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middleware/auth");



const PORT = "7777";
const app = express();
app.use(express.json());
app.use(cookieParser());

//to read cookie - middleeware - cookieparser

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const connectionRequestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', connectionRequestRouter);





connectDB().then(() => {
  console.log("DB is connected successfully");
    app.listen(PORT, ()=> {
     console.log(`Server is runnning on port ${PORT}`)
    });
}).catch((err) => {
  console.error('DB connection error:', err);
});

