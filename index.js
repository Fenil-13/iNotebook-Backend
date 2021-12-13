const connectToMongo = require('./db')
const express = require('express')

connectToMongo()
const app = express()
const port = 1353

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
    res.send("Welcome to iNotebook API")
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})