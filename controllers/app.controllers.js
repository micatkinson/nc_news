const { fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchArticleComments, addComment, updateArticles, removeComment, fetchUsers, fetchUsersByUsername } = require("../models/app.models")
const fs = require("fs/promises")



exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    });
};

exports.getApi = (req, res) => {
    fetchApi().then((endPoint) => {
        res.status(200).send({endpoint: endPoint})
    })
}

exports.getArticlesById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then((article) =>  {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    });
}

exports.getArticles = (req, res, next) => {
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

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleComments(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err);
    });
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const comment = req.body;
    addComment(article_id, comment).then((addedComment) =>  {
        res.status(201).send({addedComment});
    }).catch((err) =>  {
        next(err);
    });
}

exports.patchArticles = (req, res, next) => {
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

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then(() =>  {
        res.status(204).end()
    }).catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) =>  {
        res.status(200).send({users})
    });
}

exports.getUsersByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUsersByUsername(username).then((user) =>  {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err);
    });
}

