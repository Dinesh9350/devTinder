//Diving into api 
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");

const PORT = "7777";
const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
    
    try {
        const user = new User(req.body);
        await user.save();
        res.send("User added Successfully!");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error saving user");
    }
});

app.get("/user", async(req, res)=> {
    console.log("email---", req.body);
    
    try { 
        const user = await User.find({email: req.body.email});
        if (user.length === 0) {
            res.status(500).send("Error finding user");
        }else{
            res.send(user); 
        }
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send("Error finding user");
    }
   
});

app.delete("/user", async(req, res)=> {
    const userId = req.body.userId;
    console.log(userId);
    
    try {
        const deletedUser = await User.findOneAndDelete(userId);
        res.send(`user deleted Successfully: ${deletedUser}`)
        
    } catch (error) {
        res.status(500).send("Error deleting user");

    }
});

app.patch("/user", async(req,res)=> {

    const userId = req.body.userId;
    const data = req.body;
    console.log(data);
    
    try {
        //it'll return document which was before update
        // const user = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "before"} );
        const patchedUser = await User.findByIdAndUpdate({_id: userId}, data)
        res.send(`User updated successfully ${patchedUser}`);
    } catch (error) {
         res.status(500).send("Error updating user");
    }
})

app.get("/feed", async(req, res)=>{
    try {
         const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error getting user");
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

