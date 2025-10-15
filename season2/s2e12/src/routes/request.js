const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");



const connectionRequestRouter = express.Router();


// - POST /request/send/interested/:userId
// - POST /request/send/ignored/:userId
// - POST /request/review/accepted/:requestId
// - POST /request/review/rejected/:requestId

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored, interested"];

        if (allowedStatus.includes(status)) {
            res.status(400).json({ message: "invalid status type" + status });
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        //if toUser is same as fromUser

        //check that coming toUserId exists in db
        const toUser = await User.findOne({ _id: toUserId });
        if (!toUser) {
            res.status(404).json({ message: "User not found!" })
        }

        //if there is existing connection request
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId
                }, {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });

        if (existingConnectionRequest) {
            res.status(400).json({ message: "Connection request already exists", data: existingConnectionRequest })
        }

        const data = await connectionRequest.save();
        res.json({ message: req.user.firstName + " is " + status + " in " + toUser.firstName })
    } catch (error) {
        res.status(400).send("Error" + error);
    }

});

connectionRequestRouter.post("/request/send/ignored/:toUserId", async (req, res) => {

});

connectionRequestRouter.post("/request/review/accepted/:fromUserId", async (req, res) => {

});

connectionRequestRouter.post("/request/review/rejected/:fromUserId", async (req, res) => {

});

module.exports = connectionRequestRouter;