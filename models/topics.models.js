const db = require("../db/connection")

function fetchTopics(){
    return db.query('SELECT * FROM topics').then(({rows}) => {
        return rows;
    }).catch((err) => {
        next(err);
    });
};


module.exports = { fetchTopics }