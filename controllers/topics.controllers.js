const { fetchTopics, fetchApi } = require("../models/topics.models")
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


module.exports = { getTopics, getApi }