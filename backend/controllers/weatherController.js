const axios = require('axios');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const Token = require('../models/Token');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const getWeather = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const uuid = decoded.uuid;

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${uuid}`);

        res.json(response.data);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getWeatherByCity = async (req, res) => {
    const { city } = req.query;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
    }

    try {
        jwt.verify(token, JWT_SECRET_KEY);
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather by city:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getPublicWeather = async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
    }

    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching public weather:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const saveToken = async (req, res) => {
    try {
        const newToken = new Token({
            userId: req.body.userId,
            token: req.body.token,
            location: req.body.location
        });
        await newToken.save();
        res.send('Token received and saved');
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).send('Error saving token');
    }
};

const sendNotification = async (req, res) => {
    const token = await Token.find({});

    if (!token.length) {
        return res.status(404).json({ message: 'No tokens found' });
    }

    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${token[0].location}`);

        const maxWindSpeed = response.data.forecast.forecastday[0].day.maxwind_mph;
        const maxTemp = response.data.forecast.forecastday[0].day.maxtemp_c;
        const chanceOfRain = response.data.forecast.forecastday[0].day.daily_chance_of_rain;
        const chanceOfSnow = response.data.forecast.forecastday[0].day.daily_chance_of_snow;

        const message = {
            notification: {
                title: "Weather Update",
                body: "Maximum wind Speed in your area: " + maxWindSpeed + '\n' +
                    "Maximum Temperature in your area: " + maxTemp + '\n' +
                    "Chances of Rain in your area: " + chanceOfRain + '\n' +
                    "Chances of snow in your area: " + chanceOfSnow
            },
            token: token[0].token
        };

        const result = await admin.messaging().send(message);
        console.log('Successfully sent message:', result);
        res.send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    }
};

module.exports = {
    getWeather,
    getWeatherByCity,
    getPublicWeather,
    saveToken,
    sendNotification
};
