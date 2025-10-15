const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is not supportd`
        }
    }
}, {
    Timestamp: true
});

//compund index : 1 means Ascending, -1 descending
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//it is like a middleware whenever model would be saved itll call this function
connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this;
    //check if fromUserId and toUserId are same
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;