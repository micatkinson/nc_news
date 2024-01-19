const usersRouter = require('express').Router();
const { getUsers } = require("../controllers/app.controllers")

usersRouter
.route('/')
.get(getUsers)

module.exports = usersRouter;



// app.get("/api/users", getUsers)