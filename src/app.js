// import express from "express";
const express = require("express")

const PORT = "7777";
const app = express();

app.use('/', (req, res)=>{
    res.send("home page");
});

app.use('/test', (req, res)=>{
    res.send("Test dsds!");
});
app.use('/hello', (req, res)=>{
    res.send("Hello World ");
});

app.listen(PORT, ()=> {
     console.log(`Server is runnning on port ${PORT}`)
});