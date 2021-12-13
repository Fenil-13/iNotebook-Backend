const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.json({
        error: "You are not authenticate for notes"
    })
})

module.exports = router