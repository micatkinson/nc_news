const db = require("../db/connection")
const fs = require("fs/promises")
const { checkValidTopic } = require("../db/seeds/utils")

function fetchTopics(){
    return db.query('SELECT * FROM topics').then(({rows}) => {
        return rows;
    });
};

function fetchApi(){
    return fs.readFile("./endpoints.json", 'utf-8')
    .then((data) => {
        return JSON.parse(data)
    });
};

function fetchArticleById(article_id){
    const query = ` SELECT articles.*,
                    COUNT(comments.article_id) AS comment_count
                    FROM articles
                    LEFT JOIN comments
                    ON articles.article_id = comments.article_id
                    WHERE articles.article_id = $1
                    GROUP BY 
                    articles.article_id,
                    articles.title
                    ;`
   
    return db.query(query, [article_id])
        .then((result) => {
            if (result.rows.length === 0){
                return Promise.reject({status: 404, msg: 'article_id does not exist'})
            } else {
                return result.rows[0];
            }
    });
};



function fetchArticles(topic){

    return checkValidTopic(topic)
    .then(() => {

    let query =  `  SELECT articles.author, title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url,
                    COUNT(comments.article_id) AS comment_count 
                    FROM articles
                    LEFT JOIN comments
                    ON articles.article_id = comments.article_id
                    `;
    
    const queryParams = []
    if(topic){
        query += " WHERE topic = $1";
        queryParams.push(topic);
    }

    query += `  GROUP BY 
                articles.title, articles.article_id
                ORDER BY created_at DESC;`
           
    return db.query(query, queryParams)
        .then((result) => {
            return result.rows;
    });
    })
};

function fetchArticleComments(article_id){
    const query = `SELECT * FROM comments
                    WHERE article_id = $1
                    ORDER BY created_at DESC;`
    return db.query(query, [article_id])
    .then((result) => {
        if (result.rows.length === 0){
            return db.query(`SELECT title FROM articles WHERE article_id = $1`, [article_id])
            .then((result) =>  {
                if (result.rows.length === 0){
                   return Promise.reject({status: 404, msg: 'article_id does not exist'})
                } return []
            })
        } else {
            return result.rows;
        }
    });
};

function addComment(article_id, comment){
    const query =  `INSERT INTO comments
                   (article_id, author, body)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *`

    
    return db.query(query, [article_id, comment.username, comment.body])
    .then(result => {
        return result.rows[0]
        })
}

function updateArticles(article_id, incVotes){
    const query = `UPDATE articles
                    SET votes = votes + $1
                    WHERE article_id = $2
                    RETURNING *`
    
    return db.query(query, [incVotes, article_id])
    .then((result) =>  {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article_id does not exist'})
        }
        return result.rows[0]
    })
}

function removeComment(comment_id){
    const query = `DELETE FROM comments
                    WHERE comment_id = $1
                    RETURNING *
                   `

    return db.query(query, [comment_id])
    .then((result) =>  {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'comment_id not found'})
        }
    })
};

function fetchUsers(){
    return db.query('SELECT * FROM users').then(({rows}) => {
        return rows;
    });
}


module.exports = { fetchTopics, fetchApi, fetchArticleById, fetchArticles, fetchArticleComments, addComment, updateArticles, removeComment, fetchUsers }
