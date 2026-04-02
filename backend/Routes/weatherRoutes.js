const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const {
    getWeather,
    getWeatherByCity,
    getPublicWeather,
    saveToken,
    sendNotification
} = require('../controllers/weatherController');

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

router.get('/weather', getWeather);
router.get('/weather-by-city', getWeatherByCity);
router.get('/public-weather', getPublicWeather);
router.post('/save-token', saveToken);
router.post('/send-notification', sendNotification);

module.exports = router;
