const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/creatuser', [
    body('email', 'not a valid email').isEmail(),
    body('password', 'please enter strong password').isLength({ min: 5 })
], registerUser);

router.post('/loginuser', [
    body('email', 'not a valid email').isEmail(),
    body('password', 'please enter strong password').isLength({ min: 5 })
], loginUser);

module.exports = router;
