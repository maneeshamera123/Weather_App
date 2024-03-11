const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const axios =  require('axios');
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const db = require("../db")
const mongoose=require('mongoose')

router.get('/weather', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    const uuid = decoded.uuid;

    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=dc6b7772fa134eda80660624241003&q=${uuid}`);

    res.json(response.data);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const tokenForNotification = require('../models/saveToken');

const serviceAccount = require('../weatherapp-69015-firebase-adminsdk-lecml-5a3cb0bc86.json');
const saveToken = require('../models/saveToken');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
router.use(bodyParser.json());

router.post('/save-token', async (req, res) => {
  try {
    const token = req.body.token;
    const newToken = new tokenForNotification({
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

router.post('/send-notification', async (req, res) => {

 const token = await saveToken.find({});
//  console.log(token[0].location)
const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=dc6b7772fa134eda80660624241003&q=${token[0].location}`);
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
    console.log(message.data)
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

module.exports = router;
