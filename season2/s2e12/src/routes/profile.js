const express = require("express");
const User = require("../models/user");
const {userAuth} = require("../middleware/auth");
const { validateSignUpData, validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth ,async(req, res)=>{
    try {
         const user= req.user
         res.send(user);
    } catch (error) {
        res.status(500).send(`Error finding user ${error}`);

    }
   
});

profileRouter.post("/profile/edit",userAuth , async(req, res)=> {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!")
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        console.log(loggedInUser);
        await loggedInUser.save();

       
        
    } catch (error) {
        res.status(500).send(`Error Editing user ${error}`);

    }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const {currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new Error("Current and new password are required" );
        }

        const isPasswordCorrect =  await bcrypt.compare(currentPassword, user.password);
        if(!isPasswordCorrect){
            throw new Error("Please enter correct Current Password");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please enter Strong new Password");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.save();
        res.send("Password Updated Sucesssfully");
    } catch (error) {
        res.status(500).json({ error: `Error updating password: ${error.message}` });
    }
});




module.exports = profileRouter;