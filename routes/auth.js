const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authUser = require('../middleware/authUser')

const JWT_SECRET = 'FenilDevloper013'

router.get('/', (req, res) => {
    res.json({
        error: "You are not authenticate for login or sign up"
    })
})

router.post('/create_user',
    [body('name', 'Enter the valid name').isLength({ min: 3 }),
    body('email', 'Enter the valid Email').isEmail(),
    body('password', 'Enter the valid Password').isLength({ min: 6 }),],
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
            const salt = await bcrypt.genSaltSync(10);
            const secPass = await bcrypt.hash(req.body.password, salt)


            let user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email
            }).catch(err => {
                res.status(400).json({ error: err.message })
            })
            const authToken = await jwt.sign({ user: { id: user.id } }, JWT_SECRET);
            res.json({
                authToken: authToken,
                status: "User Created Successfully"
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }

    }
);

router.post('/login_user', [body('email').isEmail(), body('password', 'password can not be blank').exists()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ error: "Try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Try to login with correct credentials" });
        }
        const authToken = await jwt.sign({ user: { id: user.id } }, JWT_SECRET);
        res.json({
            authToken: authToken,
            status: "Login Successfully"
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


router.get('/get_user', authUser, async (req, res) => {

    try {
        const userId = req.data.id;
        const user = await User.findById(userId).select("-password")
        res.json({ user: user, status: "User Fetched Successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router