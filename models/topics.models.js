const db = require("../db/connection")
const fs = require("fs/promises")

function fetchTopics(){
    return db.query('SELECT * FROM topics').then(({rows}) => {
        return rows;
    })
};

function fetchApi(){
    return fs.readFile("./endpoints.json", 'utf-8')
    .then((data) => {
        return JSON.parse(data)
    })
}

function fetchArticleById(article_id, next){
    const query = ` SELECT * FROM articles
                    WHERE articles.article_id = $1;`
   
    return db.query(query, [article_id])
        .then((result) => {
            if (result.rows.length === 0){
                return Promise.reject({status: 404, msg: 'article_id does not exist'})
            } else {
                return result.rows[0];
            }
    });
};


function fetchArticles(){
    return db.query(`SELECT articles.author, title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url,
                    COUNT(comments.article_id) AS comment_count 
                    FROM articles
                    LEFT JOIN comments
                    ON articles.article_id = comments.article_id
                    GROUP BY 
                    articles.title, articles.article_id
                    ORDER BY created_at DESC
                    `).then(({rows}) => {
                    return rows;
});
}




module.exports = { fetchTopics, fetchApi, fetchArticleById, fetchArticles }
