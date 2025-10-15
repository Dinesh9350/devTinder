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

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "email","age", "gender", "photoUrl", "skills", "about"];
    const isEditAllowed = Object.keys(req.body).every(field => 
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}