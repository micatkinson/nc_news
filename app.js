const express = require("express")
const Port = 3000

const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);


app.use((err, req, res, next) =>  {
    
})


module.exports = app;