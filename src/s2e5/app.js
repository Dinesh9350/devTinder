//Routing and Request handlers


// import express from "express";
const express = require("express")

const PORT = "7777";
const app = express();

app.use('/test', (req, res)=>{
    res.send("Test dsds!");
});


app.get("/user", (req, res) => {
    // user/:userId/:name/:password
    // //user/07/Dinesh
    console.log(req.params);
    // /user/?userID=69
    console.log(req.query);
    
    res.send({
        "firstname": "Dinesh",
        "lastname": "Singh"
    })
})

app.post("/user", (req, res) => {
    const data = req.body;
})


app.listen(PORT, ()=> {
     console.log(`Server is runnning on port ${PORT}`)
});