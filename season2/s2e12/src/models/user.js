// user.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true, // query will be faster
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
        enum: {
            values: ["male", "female"],
            message: `{VALUE} is not a valid gender type`
        }
        // validate(value){
        //     if(!["male", "female"].includes(value)){
        //         throw new Error("Gener data is not valid");

        //     }
        // }
    },
    email: {
        type: String,
        required: true,
        unique: true, //already have index
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`Invalid Email Address: ${value}`);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error(`Enter a Strong Password: ${value} `);
            }
        }
    },
    about: {
        type: String,
        default: "About me!"
    },
    skills: {
        type: [String],

    },
    photoUrl: {
        type: String,
        default: "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error(`Invalid photo Url: ${value} `);
            }
        }
    },

}, {
    timestamps: true
});

//we are writing normal function because of this keyword is not available in arrow functions
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dinesh@dev$123",
        { expiresIn: "7d" }
    );
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
