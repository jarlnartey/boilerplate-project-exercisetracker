const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const connectDB = require("./config/db.js")
const path = require('path')

connectDB()

const bodyParser = require("body-parser")
const { urlencoded } = require('express')
const { userInfo } = require('os')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/index.html"))
});

app.use("/api/users", require("./routes/usersRoutes"))

const listener = app.listen(process.env.PORT || 5000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
