const jwt = require('jsonwebtoken');
const JWT_SECRET = 'FenilDevloper013'

const authUser = async (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send({ error: "Access Denied!!.Please Authenticated with valid token" });
    }
    try {
        const data = await jwt.verify(token, JWT_SECRET)
        req.data = data.user
        next()
    } catch (error) {
        return res.status(401).send({ error: "Access Denied!!.Please Authenticated with valid token" });
    }
}

module.exports = authUser