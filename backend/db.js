require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGOURI;
const connection = mongoose.connect(uri);

mongoose.connect(uri).then(()=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err,"Connection failed")
});

module.exports = mongoose.connection;

