const express = require("express")
const Port = 3000

const { getTopics, getApi, getArticlesById, getArticles, getArticleComments, postComment, patchArticles } = require("./controllers/topics.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id/", patchArticles)

app.all('*', function(req , res) {
    res.status(404).send({msg: 'Not Found'})
})

app.use((err, req, res, next) =>  {
    if (err.status === 404){
        res.status(404).send({msg: err.msg})
    } else {
        next(err);
    };
});


app.use((err, req, res, next) =>   {
    if (err.code === '22P02' || err.code === '23502'){
        res.status(400).send({msg: 'Bad request'})
    } else {
        next(err);
    };
});

app.use((err, req, res, next) =>  {
    if (err.code === '23503'){
            res.status(404).send({msg: 'Recieved invalid value'})
    }
})


module.exports = app;