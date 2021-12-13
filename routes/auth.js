const express = require('express')
const User = require('../models/User')
const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        error: "You are not authenticate for login or sign up"
    })
})

router.post('/create_user', (req, res) => {
    console.log(req.body)
    const user = User(req.body)
    user.save()
    res.json({
        status: "User Created Successfully"
    })
})
module.exports = router