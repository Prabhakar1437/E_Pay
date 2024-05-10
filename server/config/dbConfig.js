const mongoose = require('mongoose');

console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);

const connectionResult= mongoose.connection;

connectionResult.on('error', ()=>{
    console.log('Connection error:')
});
connectionResult.on('connected', ()=>{
    console.log('MongoDB connected successfully')
});
