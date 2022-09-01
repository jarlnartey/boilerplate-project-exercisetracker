const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if (err) console.log("error: " + err)
})

const bodyParser = require("body-parser")
const { urlencoded } = require('express')
app.use(bodyParser.urlencoded({ extended: true }))


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, required: false },
  log: { type: [Object], required: false }
})

const User = mongoose.model("User", userSchema)

// Create user
app.post("/api/users", (req, res) => {
  let input = req.body.username
  new User({ username: input, count: 0, log: [] })
    .save((err, data) => {
      res.send({ username: data.username, _id: data._id })
    })
})

// Get all users
app.get("/api/users", (req, res) => {
  User.find({}, (err, users) => {
    let allUsers = []
    users.forEach(user => {
      let userObject = { _id: user._id, username: user.username }
      allUsers.push(userObject)
    })
    res.send(allUsers)
  })
})

// Post exercises to user
app.post("/api/users/:id/exercises", (req, res) => {
  let id = req.params.id
  let description = req.body.description
  let duration = parseInt(req.body.duration)
  let date = req.body.date

  if (!date) {
    date = new Date().toISOString().split("T")[0]
  }

  let workout = { description: description, duration: duration, date: date }

  User.findById(id, (err, result) => {
    if (err) { }
    result.log.push(workout)
    result.count += 1
    result.save((err, data) => {
      let responseObject = {
        _id: data._id,
        username: data.username,
        date: data.log.at(-1).date,
        duration: data.log.at(-1).duration,
        description: data.log.at(-1).description
      }
      res.send(responseObject)
    })
  })
})

app.get("/api/users/:_id/logs", (req, res) => {
  let _id = req.params._id

  User.findById(_id, (err, data) => {
    res.send({ _id: data._id, username: data.usernamem, count: data.count, log: data.log })
  })
})

app.get("/api/users/:_id/logs?from&to&limit", (req, res) => {
  console.log("hello")
  console.log(req.params)
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
