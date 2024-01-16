const { fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchArticleComments } = require("../models/topics.models")
const fs = require("fs/promises")


function getTopics(req, res){
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    });
};

function getApi(req, res){
    fetchApi().then((endPoint) => {
        res.status(200).send({endpoint: endPoint})
    })
}

function getArticlesById(req, res, next){
    const {article_id} = req.params;
    fetchArticleById(article_id).then((article) =>  {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    });
}

function getArticles(req, res, next){
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
    }).catch((err) =>  {
        next(err)
    });
}

function getArticleComments(req, res, next){
    const {article_id} = req.params;
    fetchArticleComments(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err);
    });
}


module.exports = { getTopics, getApi, getArticlesById, getArticles, getArticleComments }