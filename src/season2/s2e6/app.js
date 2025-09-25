//--------Middlewares & Error handlers----------


// import express from "express";
const express = require("express")
const {adminAuth, userAuth} = require('./middleware/auth');

const PORT = "7777";
const app = express();

//app.use -- cover all routes after that like /user will cover /user/123/xyz

//---------this will not be sent to 2nd route handler ----------
// app.use("/user", (req, res) => {
//     console.log("first handler");
// }, (req, res) => {
//     console.log("second handler");
//     res.send("second response")
// })

//----------res.send send can be only one in router handlers-------
// app.use("/user", (req, res, next) => {
//     console.log("first handler");
//     next();
// }, (req, res) => {
//     console.log("second handler");
//     res.send("second response")
// })


//------------Error because it'll try to resolve first router handler and log and go to next() while will send it to the second route handler which will log and do res.send(), since there only can be on res.send() in a route so it'll go the first route handler where next() got exacuted and as soon as it reacheas 2nd res.send() it'll throw an error
// app.use("/user", (req, res, next) => {
//     console.log("first handler");
//     next();
//     res.send("second response")
// }, (req, res) => {
//     console.log("second handler");
//     res.send("second response")
// })

// app.use("/user", (req, res, next) => {
//     console.log("first handler");
//     next();
//     res.send("second response")
// }, (req, res) => {
//     console.log("second handler");
//     res.send("second response")
// })

//------admin middleware --------

app.use('/admin', adminAuth)

app.get("/admin/getAllData", (req, res) => {
    res.send("All the data");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted the user");
});

//------user middleware --------sss
app.get("/user", userAuth ,(req, res) => {
    res.send("user data sent");
});

//-----Error handling try catch --------
app.get('/getUserData', (req, res) => {
    try {
        throw new Error("jshdasdkha");
        res.send("user data sent!")
    } catch (err) {
        res.status(500).send("Something went wrong, contact support team!")
    }
});

app.use("/", (err, req, res, next)=> {
    if(err){
        //log error
        res.status(500).send("Something went wrong!")
    }

});



// whatever we do inside app.use and make many route handlers are called as MIDDLEWARE

app.listen(PORT, ()=> {
     console.log(`Server is runnning on port ${PORT}`)
});