const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const axios =  require('axios');
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const db = require("../db")

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

module.exports = router;
