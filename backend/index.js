require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('./db');

const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

const authRoutes = require('./Routes/authRoutes');
const weatherRoutes = require('./Routes/weatherRoutes');
const { startWeatherAlertScheduler, checkWeatherAndNotifyAllUsers } = require('./services/weatherAlertScheduler');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Weather App API');
});

app.use('/api', authRoutes);
app.use('/api', weatherRoutes);

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
    console.log(`Server running on port ${port}`);
});