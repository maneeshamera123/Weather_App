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
const { startWeatherAlertScheduler, checkWeatherAndNotifyAllUsers } = require('./services/weatherAlertScheduler');

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', WeatherData);

app.post('/api/test-weather-alert', async (req, res) => {
    try {
        await checkWeatherAndNotifyAllUsers();
        res.json({ success: true, message: 'Weather check completed. Check server logs for details.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

startWeatherAlertScheduler();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});