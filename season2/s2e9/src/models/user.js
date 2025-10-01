// user.js
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        // required: true,
        min: 18
    },
    gender: {
        type: String,
         lowercase: true,
        validate(value){
            if(!["male", "female"].includes(value)){
                throw new Error("Gener data is not valid");
                
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`Invalid Email Address: ${value}`);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error(`Enter a Strong Password: ${value} `);
            }
        }
    },
    about : {
        type: String,
        default: "About me!"
    },
    skills: {
        type: [String],

    },
    photoUrl: {
        type: String,
        default: "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error(`Invalid photo Url: ${value} `);
            }
        }
    },
    
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
