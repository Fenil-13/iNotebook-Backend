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
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        User.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        }).then(user => res.json({
            userData: user,
            status: "User Created Successfully"
        }))
            .catch(err => {
                res.status(400).json({ error: err.message })
            })

    }
);
module.exports = router