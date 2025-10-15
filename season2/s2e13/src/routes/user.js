const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require('../models/user')

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "skills"];

//to get recieved requests
userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', USER_SAFE_DATA);
        //.populate('fromUserId') will give me the whole data of this using by referencing to User Collection, using [] we can choose seletive keys

        if (!connectionRequests || connectionRequests.length === 0) {
            return res.status(404).json({
                message: "connection request not found!",
                success: false,
            })
        }
        res.json({
            message: "Connection request found",
            data: connectionRequests
        })

    } catch (error) {
        res.status(400).send("Error" + error);
    }
});

//to get friends
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const friends = await ConnectionRequestModel.find({
            $or: [
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        if (!friends || friends.length === 0) {
            return res.status(404).json({ message: "No Friend found!" })
        }

        const data = friends?.map((friend) => {
            // we cannot compare two mongodb it like this: friend.fromUserId === loggedInUser._id
            if (friend.fromUserId.toString() === loggedInUser._id.toString()) {
                return friend.toUserId;
            }
            return friend.fromUserId;

        })

        res.json({ message: "fetched friends", data: friends });

    } catch (error) {
        res.status(400).send("Error" + error);
    }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
    //user should see all user cards except:
    // 1. his own
    // 2. his connection
    // 3. ignored 
    // 4. already sent the connection request 

    const loggedInUser = req.user;
    console.log("loggedInUser: ", loggedInUser);

    //sent or recieved connnectionr request
    const connectionRequest = await ConnectionRequestModel.find({
        $or: [
            { fromUserId: loggedInUser._id },
            { toUserId: loggedInUser._id }
        ]
    }).select("fromUserId toUserId");

    console.log("fromUserId", fromUserId);
    console.log("toUserId", toUserId);



    //to find unique id we are using Set()
    //req.fromUserId._id it is coming from populate function

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId._id.toString());
        hideUsersFromFeed.add(req.toUserId._id.toString());
    });

    console.log(hideUsersFromFeed);

    const users = await User.find({

    });
    res.json({
        message: "sent interested or rejected || recieved interested and rejeced connections",
        data: connectionRequest
    })
});

module.exports = userRouter;