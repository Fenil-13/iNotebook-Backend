const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    res.json({
        error: "You are not authenticate for login or sign up"
    })
})

router.post('/create_user',
    [body('email').isEmail(),
    body('password').isLength({ min: 6 }),],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
            let findUser = await User.findOne({ email: req.body.email })
            if (findUser) {
                return res.status(400).json({ error: "User with this email already exits" })
            }
            let user = await User.create({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email
            }).catch(err => {
                res.status(400).json({ error: err.message })
            })
            res.json({
                userData: user,
                status: "User Created Successfully"
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }
);
module.exports = router