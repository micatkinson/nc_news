const express = require("express")
const Port = 3000

const { getTopics, getApi, getArticlesById, getArticles, getArticleComments, postComment, patchArticles, deleteComment, getUsers } = require("./controllers/app.controllers");

const { handleCustomErrors, handleBadPsqlErrors, handleInvalidPsqlErrors } = require("./errors.index")

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id/", patchArticles)

app.delete("/api/comments/:comment_id", deleteComment) 

app.all('*', function(req , res) {
    res.status(404).send({msg: 'Not Found'})
})

app.use(handleCustomErrors)
app.use(handleBadPsqlErrors)
app.use(handleInvalidPsqlErrors)


module.exports = app;