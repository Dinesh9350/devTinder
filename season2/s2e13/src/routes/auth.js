const express = require("express");

const authRouter = express.Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt")

authRouter.post("/signup", async (req, res) => {
    try {
        //validation of data - validator
         validateSignUpData(req);

         //encypt the password - bcrypt
        const {firstName, lastName, email, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(password);
        
        const user = new User({
            firstName, 
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.send(`User added Successfully: ${user}`);
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send(`Error saving user: ${error}`);
    }
});

authRouter.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email: email})

        if(!user) {
            throw new Error("Invalid email or password!");
        }

        //offloading brcypt to userSchema
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            //create a jwt token
            //offloading it to user schema
            // const token = await jwt.sign({ _id: user._id}, "Dinesh@dev$123", {expiresIn: "7d"});
            const token = await user.getJWT();
            console.log("token--", token);
            

            //add token to cookie and send response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  //7 days
            })

            res.send("Login Successfully!");
        }else{
            throw new Error("Invalid password!");
        }
        
    } catch (error) {
        res.status(400).send("Error login user:" +  error);
    }
});

authRouter.post('/logout', async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout successfully");
});

module.exports = authRouter;