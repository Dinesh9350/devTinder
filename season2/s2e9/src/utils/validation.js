const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Please Enter Name");
    }else if(!validator.isEmail(email)){
        throw new Error("Enter a valid email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter Strong Password");
    }
}

module.exports = {
    validateSignUpData
}