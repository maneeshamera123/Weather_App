const express = require("express");
const mongoose = require("mongoose")
require("./db");

const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors());

app.get('/', cors(), async (req, res) => {
    res.send("Hello world")
});

const userRouter = require('./Routes/CreateUser');
const WeatherData = require('./Routes/weatherData');

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', WeatherData);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});