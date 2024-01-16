const express = require("express")
const Port = 3000

const { getTopics, getApi, getArticlesById } = require("./controllers/topics.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticlesById)

app.all('*', function(req , res) {
    throw new Error('Bad Request')
})

app.use((err, req, res, next) =>  {
    if (err.message === 'Bad Request'){
        res.status(404).send({msg: 'Not Found'})
    } else {
        next(err);
    };
});

app.use((err, req, res, next) =>  {
    if (err.status === 404){
        res.status(404).send({msg: err.msg})
    } else {
        next(err);
    };
});

app.use((err, req, res, next) =>   {
    if (err.code === '22P02'){
        res.status(400).send({msg: 'Bad request'})
    }
})

module.exports = app;