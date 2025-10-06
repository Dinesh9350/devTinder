const jwt = require('jsonwebtoken');
const User = require("../models/user");
const bcrypt = require("bcrypt")



const userAuth = async(req, res, next) => {
  try {
     //read the token from the req.cookies
    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
      throw new Error("Invalid token")
    }
    //validate the token
    const decodedMessage = await jwt.verify(token, "Dinesh@dev$123");
    const {_id} = decodedMessage;


    //find the user
    const user = await User.findById(_id);
    if(!user){
      throw new Error("User does not exist!");
    }
    //attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    res.status(400).send(`Error : ${error}`);
  } 
}

module.exports = { userAuth};