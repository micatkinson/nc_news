const db = require("../db/connection")
const fs = require("fs/promises")

function fetchTopics(){
    return db.query('SELECT * FROM topics').then(({rows}) => {
        return rows;
    }).catch((err) => {
        next(err);
    });
};

function fetchApi(){
    return fs.readFile("./endpoints.json", 'utf-8')
    .then((data) => {
        return JSON.parse(data)
    }).catch((err) => {
        next(err)
    }); 
}



module.exports = { fetchTopics, fetchApi }