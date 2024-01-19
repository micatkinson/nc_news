const articlesRouter = require('express').Router();
const { getArticles, getArticlesById, patchArticles, getArticleComments, postComment } = require("../controllers/app.controllers")

articlesRouter
.route('/')
.get(getArticles)

articlesRouter
.route('/:article_id')
.get(getArticlesById)
.patch(patchArticles)

articlesRouter
.route('/:article_id/comments')
.get(getArticleComments)
.post(postComment)

module.exports = articlesRouter;