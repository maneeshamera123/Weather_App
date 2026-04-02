const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSec = process.env.JWTSCE;

const registerUser = async (req, res) => {
    const { body, validationResult } = require('express-validator');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, location } = req.body;

    try {
        const salt = await bcrypt.genSalt(8);
        const secPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: secPassword,
            location
        });

        await newUser.save();
        res.json({ success: true, userId: newUser.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
};

const loginUser = async (req, res) => {
    const { body, validationResult } = require('express-validator');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(payload, jwtSec);
        const uuidToken = jwt.sign({ uuid: user.location }, process.env.JWT_SECRET_KEY);

        res.json({ success: true, authToken, uuidToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    registerUser,
    loginUser
};
