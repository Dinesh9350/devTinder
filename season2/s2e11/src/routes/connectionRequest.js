const express = require("express");
const User = require("../models/user");
const {userAuth} = require("../middleware/auth");



const connectionRequestRouter = express.Router(); 

connectionRequestRouter.post('/sendConnectionRequest', userAuth,async(req, res)=> {
    //sending a connection request
    const user = req.user;
    res.send("Connection Request Sent!")
})

connectionRequestRouter.post("/request/send/interested/:userId",(req, res)=> {

});

connectionRequestRouter.post("/request/send/ignored/:userId",(req, res)=> {

});

connectionRequestRouter.post("/request/review/accepted/:requestId",(req, res)=> {

});

connectionRequestRouter.post("/request/review/rejected/:requestId",(req, res)=> {

});

module.exports = connectionRequestRouter;