const usersRouter = require('express').Router();
const { getUsers, getUsersByUsername } = require("../controllers/app.controllers")

usersRouter
.route('/')
.get(getUsers)

usersRouter
.route('/:username')
.get(getUsersByUsername)

module.exports = usersRouter;



// app.get("/api/users", getUsers)