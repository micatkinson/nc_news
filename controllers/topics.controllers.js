const { fetchTopics } = require("../models/topics.models")


function getTopics(req, res){
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    }); 
}


module.exports = { getTopics }