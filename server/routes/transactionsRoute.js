const router=require('express').Router();
const Transaction = require("../models/transactionModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

// transfer money from one account to another

router.post("/transfer-funds", authMiddleware , async (req,res)=> {
    try {

        // save the transaction
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();

        // decrease sender balance
        await User.findByIdAndUpdate(req.body.sender , {
            $inc : { balance: -req.body.amount},
        });

        //increase reciever balance
        await User.findByIdAndUpdate(req.body.receiver , {
            $inc : { balance: req.body.amount},
        });


        res.send({
            message : "Transaction Successful",
            data : newTransaction,
            success : true
        });

    } catch (error) {
        res.send({
            message : "Transaction Failed",
            data : error.message,
            success : false
        });
    }
});


// verify receiver account number

router.post("/verify-account" , authMiddleware , async (req,res)=> {
    try {
        const user = await User.findOne({ _id : req.body.receiver });
        if(user){
            res.send({
                message : "Account Verified",
                data : user,
                success : true
            });
        }
        else{
            res.send({
                message : "Account Not Found",
                data : null,
                success : false
            });
        }
    } catch (error) {
        res.send({
            message : "Account Not Found",
            data : error.message,
            success : false
        });
    }
});


// get all transactions for user

router.post("/get-all-transactions" , authMiddleware , async (req,res)=> {
    try {
        const transactions = await Transaction.find({
            $or : [{ sender : req.body.userId } , { receiver : req.body.userId }],
        }).sort( {createdAt : -1} ).populate("sender").populate("receiver");
        res.send({
            message: "Transactions Fetched",
            data: transactions,
            success: true
        });
    } catch (error) {
        res.send({
            message: "Transactions Not Fetched",
            data: error.message,
            success: false
        });
    }
});


// deposit funds using stripe

const stripe = require("stripe")(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require('uuid');

router.post("/deposit-funds" , authMiddleware , async (req,res)=> {
    try {
        const {token,amount} = req.body;

        // create a customer
        const customer = await stripe.customers.create({
            name: 'Piyush Garg',
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
            },
            email: token.email,
            source: token.id,
        });


        // create a paymentIntent
        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount: amount*100,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: "Deposited To E-PAY",
                shipping: {
                    name: 'Piyush Garg',
                    address: {
                      line1: '510 Townsend St',
                      postal_code: '98140',
                      city: 'San Francisco',
                      state: 'CA',
                      country: 'US',
                    },
                },
                payment_method: "pm_card_visa",
                confirm: true,
                automatic_payment_methods:{
                    enabled: true,
                    allow_redirects: "never"
                }
            }
        );

        // save the transaction
        if(paymentIntent.status === "requires_action"){
            const newTransaction = new Transaction({
                sender: req.body.userId,
                receiver: req.body.userId,
                amount: amount,
                reference: "Stripe Deposit",
                status: "Success",
            });

            await newTransaction.save();

            // increase user balance
            await User.findByIdAndUpdate(req.body.userId, {
                $inc: {balance : amount},
            });

            res.send({
                message: "Transaction Successful",
                data: newTransaction,
                success: true
            });

        }
        else{
            res.send({
                message: "Transaction Failed",
                data: paymentIntent,
                success: false
            });
        }

    } catch (error) {
        res.send({
            message: "Transaction Failed",
            data: error.message,
            success: false
        });
    }
});

module.exports= router;