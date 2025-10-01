//Episode-10 - Authentication, JWT & Cookies

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt")
const {validateSignUpData} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middleware/auth");



const PORT = "7777";
const app = express();
app.use(express.json());
app.use(cookieParser());

//to read cookie - middleeware - cookieparser


app.post("/signup", async (req, res) => {

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

app.post('/login', async(req, res) => {
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
})

app.get("/user", async(req, res)=> {
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

app.get("/profile", userAuth ,async(req, res)=>{
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(500).send(`Error finding user ${error}`);

    }
   
});

app.post('/sendConnectionRequest', userAuth,async(req, res)=> {
    //sending a connection request
    const user = req.user;
    res.send("Connection Request Sent!")
})

connectDB().then(() => {
  console.log("DB is connected successfully");
    app.listen(PORT, ()=> {
     console.log(`Server is runnning on port ${PORT}`)
    });
}).catch((err) => {
  console.error('DB connection error:', err);
});

