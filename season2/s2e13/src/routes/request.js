const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");



const connectionRequestRouter = express.Router();


// - POST /request/send/interested/:userId
// - POST /request/send/ignored/:userId
// - POST /request/review/accepted/:requestId
// - POST /request/review/rejected/:requestId

//status - ignored, interested
connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatuses = ["ignored", "interested"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status or Status not allowed",
                success: false,
            });
        }



        //if toUser is same as fromUser

        //check that coming toUserId exists in db
        const toUser = await User.findOne({ _id: toUserId });
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" })
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
        console.log("existingConnectionRequest :", existingConnectionRequest);


        if (existingConnectionRequest) {
            res.status(400).json({ message: "Connection request already exists", data: existingConnectionRequest })
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        console.log("Saved data:", data);

        res.json({ message: req.user.firstName + " is " + status + " in " + toUser.firstName, data, success: true, })
    } catch (error) {
        res.status(400).send("Error" + error);
    }

});

//status - accepted, rejected
connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestId = req.params.requestId
        const status = req.params.status;


        //Akshay => Elon (only elon should be able to see recived requests)
        //loggedInUserId = toUserId
        //status = interested

        const allowedStatuses = ["accepted", "rejected"];

        if (!allowedStatuses.includes(status)) {
            res.status(400).json({ message: "invalid status type" + status });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        console.log("connectionRequest", connectionRequest);


        if (!connectionRequest || connectionRequest.length === 0) {
            return res.status(404).json({ message: "Connection request not found!" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request" + status, data })

    } catch (error) {
        res.status(400).send("Error" + error);
    }

});



module.exports = connectionRequestRouter;