require('dotenv').config();  // To read data from .env file using process.env.
const express=require('express');
const app=express();
app.use(express.json());  // To read data sent in the request body i.e using req.body.

const dbConfig= require('./config/dbConfig.js');
const usersRoute= require('./routes/userRoute.js');
const transactionsRoute= require('./routes/transactionsRoute.js');
const requestsRoute= require('./routes/requestsRoute.js');

app.use("/api/users",usersRoute);
app.use("/api/transactions",transactionsRoute);
app.use("/api/requests",requestsRoute);


// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Process started at on ${PORT}`);
})