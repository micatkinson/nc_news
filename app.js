const express = require("express")
const Port = 3000

const { getTopics, getApi } = require("./controllers/topics.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.all('*', function(req , res) {
    throw new Error('Bad Request')
})

app.use((err, req, res, next) =>  {
    if (err.message === 'Bad Request'){
        res.status(400).send({msg: 'Bad Request'})
    }
})


module.exports = app;