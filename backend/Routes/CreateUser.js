const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const jwtSec = "€486745896€$@fdhhsgpbkjhYUVYUDTYh"

const db = require("../db")


router.post('/creatuser', [
    body('email', 'not a valid email').isEmail(),
    body('password', 'please enter strong password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(8);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
            location : req.body.location
        });
        console.log(newUser);
        await newUser.save();
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
});


router.post('/loginuser', [
    body('email', 'not a valid email').isEmail(),
    body('password', 'please enter strong password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
     
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

       
        const payload = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(payload, jwtSec);
        const uuidToken = jwt.sign({ uuid: user.location }, 'your-secret-key');

        res.json({ success: true, authToken , uuidToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
