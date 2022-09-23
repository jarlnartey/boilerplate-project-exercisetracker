const User = require("../models/userModel")
const Exercise = require("../models/exerciseModel")
const { query } = require("express")

// @desc    Create user
// @route   post /api/users 
const createUser = (req, res) => {
    let input = req.body.username
    new User({ username: input, log: [] })
        .save((err, data) => {
            res.send({ username: data.username, _id: data._id })
        })
}

// @desc    Get all users
// @route   Get /api/users 
const getUsers = (req, res) => {
    User.find({}, (err, users) => {
        let allUsers = []
        users.forEach(user => {
            let userObject = { _id: user._id, username: user.username }
            allUsers.push(userObject)
        })
        res.send(allUsers)
    })
}

// @desc    Add exercises
// @route   Post /api/users/:id/exercises 
const addExercises = (req, res) => {
    let id = req.params.id
    let description = req.body.description
    let duration = parseInt(req.body.duration)
    let date = req.body.date

    if (!date) { date = new Date().toISOString().split("T")[0] }

    const exercise = new Exercise({ description: description, duration: duration, date: new Date(date).toISOString().split("T")[0] })

    User.findByIdAndUpdate(id, { $push: { log: exercise } }, { new: true }, (err, result) => {
        if (err) { }
        res.json({
            _id: result._id,
            username: result.username,
            date: exercise.date,
            duration: exercise.duration,
            description: exercise.description
        })
    })
}


// @desc    Get exercise log
// @route   Get /api/users/:id/exercises 
const getLogs = (req, res) => {
    User.findById(req.params._id, (err, user) => {
        if (err) { }
        responseObject = {
            _id: user._id,
            username: user.username,
            count: user.log.length,
            log: user.log
        }

        if (req.query.from || req.query.to) {
            let fromDate = new Date(0).getTime()
            let toDate = new Date().getTime()

            if (req.query.from) { fromDate = new Date(req.query.from).getTime() }
            if (req.query.to) { toDate = new Date(req.query.to).getTime() }

            responseObject.log = responseObject.log.filter(exercise => {
                return fromDate <= new Date(exercise.date).getTime() && new Date(exercise.date).getTime() <= toDate
            })
        }

        if (req.query.limit) {
            responseObject.log = responseObject.log.slice(0, req.query.limit)
        }

        res.json(responseObject)
    })
}


// @desc    Clear the database
// @route   Get /api/users/clear 
const clearAll = (req, res) => {
    User.deleteMany({}, () => { })
    res.json({ deleted: true })
}


module.exports = {
    createUser,
    getUsers,
    addExercises,
    getLogs,
    clearAll

}