const mongoose = require('mongoose');
const uri = "mongodb+srv://manishamera1213:BMYFODtUMfXSLjPP@clusterweather.6wzighe.mongodb.net/?retryWrites=true&w=majority&appName=ClusterWeather";

const connection = mongoose.connect(uri);

mongoose.connect(uri).then(()=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err,"Connection failed")
});

module.exports = mongoose.connection;

