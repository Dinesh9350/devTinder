const express = require("express");
const User = require("../models/user");

const userRouter = express.Router();
const {userAuth} = require("../middleware/auth");



userRouter.get("/user", async(req, res)=> {
    console.log("email---", req.body);
    
    try { 
        const user = await User.find({email: req.body.email});
        if (user.length === 0) {
            res.status(500).send("Error user does not exists!");
        }else{
            res.send(user); 
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send(`Error finding user ${error}`);
    }
   
});

userRouter.get("/user/feed", (req, res)=> {

});

userRouter.get("/user/connections", (req, res)=> {

});

userRouter.post("/user/requests", (req, res)=> {

});

module.exports = userRouter;