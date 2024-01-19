const { fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchArticleComments, addComment, updateArticles, removeComment, fetchUsers } = require("../models/app.models")
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
    const topic = req.query.topic;
    const sort_by = req.query.sort_by;
    const order = req.query.order;
  
    fetchArticles(topic, sort_by, order).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) =>  {
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

function postComment(req, res, next){
    const {article_id} = req.params;
    const comment = req.body;
    addComment(article_id, comment).then((addedComment) =>  {
        res.status(201).send({addedComment});
    }).catch((err) =>  {
        next(err);
    });
}

function patchArticles(req, res, next){
    const {article_id} = req.params;
    let incVotes;
    if(Object.keys(req.body).length === 1 && typeof req.body.inc_votes === 'number'){
    incVotes = parseInt(req.body.inc_votes)
    }
    updateArticles(article_id, incVotes).then((updatedArticle) =>  {
        res.status(200).send({updatedArticle})
    }).catch((err) => {
        next(err)
    });
}

function deleteComment(req, res, next){
    const { comment_id } = req.params;
    removeComment(comment_id).then(() =>  {
        res.status(204).end()
    }).catch((err) => {
        next(err)
    })
}

function getUsers(req, res, next){
    fetchUsers().then((users) =>  {
        res.status(200).send({users})
    });
}

module.exports = { getTopics, getApi, getArticlesById, getArticles, getArticleComments, postComment, patchArticles, deleteComment, getUsers }