//Episode-09 - Encrypting Passwords

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt")
const {validateSignUpData} = require("./utils/validation");

const PORT = "7777";
const app = express();
app.use(express.json());


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

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            res.send("Login Successfully!");
        }else{
            throw new Error("Invalid password!");
        }
        
    } catch (error) {
        res.status(400).send(`Error login user: ${error}`);
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

app.delete("/user", async(req, res)=> {
    const userId = req.body.userId;
    console.log(userId);
    
    try {
        const deletedUser = await User.findOneAndDelete(userId);
        res.send(`user deleted Successfully: ${deletedUser}`)
        
    } catch (error) {
        res.status(500).send(`Error deleting user: ${error}`);

    }
});

app.patch("/user/:userId", async(req,res)=> {

    const userId = req.params.userId;
    const data = req.body;
    console.log(data);

    try {
        const ALLOWED_UPDATES = ["age", "about", "skills", "photoUrl"];
        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            res.status(400).send("Update not allowed!")
        }
        if(data?.skills?.length > 10){
            res.status(400).send("Max 10 skills are allowed!")
        }
    } catch (error) {
        res.status(500).send(`Update user failed!: ${error}`);
    }

    
    try {
        //it'll return document which was before update
        const patchedUser = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "after", runValidators: true} );
        res.send(`User updated successfully ${patchedUser}`);
    } catch (error) {
         res.status(500).send(`Error updating user: ${error}`);
    }
})

app.get("/feed", async(req, res)=>{
    try {
         const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send(`Error getting user: ${error}`);
    }
   
})

connectDB().then(() => {
  console.log("DB is connected successfully");
    app.listen(PORT, ()=> {
     console.log(`Server is runnning on port ${PORT}`)
    });
}).catch((err) => {
  console.error('DB connection error:', err);
});

