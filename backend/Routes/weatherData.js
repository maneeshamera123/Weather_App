require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios =  require('axios');
const jwt = require("jsonwebtoken");
const db = require("../db")

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.get('/weather', async (req, res) => {
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
});

const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const tokenForNotification = require('../models/saveToken');

// Firebase Admin SDK configuration from environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  })
});
router.use(bodyParser.json());

router.post('/save-token', async (req, res) => {
  try {
    const newToken = new tokenForNotification({
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
});

// Route to get weather by city name (for search functionality)
router.get('/weather-by-city', async (req, res) => {
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
});

// Public endpoint for homepage weather display (no auth required)
router.get('/public-weather', async (req, res) => {
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
});

//with the help of token admin can send notification to all users
router.post('/send-notification', async (req, res) => {
 const token = await saveToken.find({});
//  console.log(token[0].location)
const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${token[0].location}`);
// console.log(response)
// res.send(response.data.forecast.forecastday[0].day)
const maxWindSpeed=response.data.forecast.forecastday[0].day.maxwind_mph
const maxTemp=response.data.forecast.forecastday[0].day.maxtemp_c
const chanceOfRain=response.data.forecast.forecastday[0].day.daily_chance_of_rain
const chanceOfSnow=response.data.forecast.forecastday[0].day.daily_chance_of_snow

  try {
    var message = {
      notification: {
          title: "Weather Update",
          body: "Maximum wind Speed in your area: " + maxWindSpeed + '\n' +
                "Maximum Temperature in your area: " + maxTemp + '\n' +
                "Chances of Rain in your area: " + chanceOfRain + '\n' +
                "Chances of snow in your area: " + chanceOfSnow
      },
      token: token[0].token
  };
    // console.log(message.data)
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

module.exports = router;
