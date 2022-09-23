const express = require("express")
const router = express.Router()
const User = require("../models/userModel")
const Exercise = require("../models/exerciseModel")
const { createUser, getUsers, addExercises, getLogs, clearAll } = require("../controllers/userController")

// Create user
router.post("/", createUser)

// Get all users
router.get("/", getUsers)

// Post exercises to user
router.post("/:id/exercises", addExercises)

// Get logs by user
router.get("/:_id/logs/", getLogs)

// Clear all
router.get("/clear", clearAll)

module.exports = router 