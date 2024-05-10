const router = require("express").Router();
const Request = require("../models/requestsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

// get all requests for user

router.post("/get-all-requests" , authMiddleware , async (req,res) =>{
    try {
        const requests = await Request.find({
            $or : [{ sender: req.body.userId }, { receiver: req.body.userId }],
        }).sort( {createdAt : -1} ).populate("sender").populate("receiver");

        res.send({
            data: requests,
            message: "Requests fetched successfully",
            success: true
        });

    } catch (error) {
        res.send({
            data: error.message,
            message: "Not able to fetch Requests",
            success: false
        });
    }
});


// send request to another user

router.post("/send-request" , authMiddleware , async(req,res) =>{
    try {
        const {receiver,amount,reference} = req.body;

        const request = new Request({
            sender: req.body.userId,
            receiver,
            amount,
            reference
        });

        await request.save();

        res.send({
            data: request,
            message: "Request sent successfully",
            success: true
        });        
    } catch (error) {
        res.send({
            data: error.message,
            message: "Unable to send Request",
            success: false
        });
    }
});


// update request status

router.post("/update-request-status" , authMiddleware , async(req,res) =>{

    try {
        if(req.body.status === "accepted"){

            // create a transaction
            const transaction = new Transaction({
                sender: req.body.receiver._id,
                receiver: req.body.sender._id,
                amount: req.body.amount,
                reference: req.body.reference,
                status: "Success"
            });

            await transaction.save();
            
            // deduct amount from request receiver
            await User.findByIdAndUpdate(req.body.receiver._id , {
                $inc : {balance : -req.body.amount},
            });

            // add amount to request sender ie who sent request
            await User.findByIdAndUpdate(req.body.sender._id , {
                $inc : {balance : req.body.amount},
            });

            // update request status
            await Request.findByIdAndUpdate(req.body._id , {
                status: "Accepted",
            });

        }
        else{
            // update request status
            await Request.findByIdAndUpdate(req.body._id , {
                status: "Rejected",
            });
        }

        res.send({
            data: null,
            message: "Request status updated successfully",
            success: true
        });

    } catch (error) {
        res.send({
            data: error.message,
            message: "Unable to update request status",
            success: false
        });
    }
});


module.exports = router;