const db = require("../db/connection")
const fs = require("fs/promises")
const { checkValidTopic, checkValidColumn } = require("../db/seeds/utils")

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics').then(({rows}) => {
        return rows;
    });
};

exports.fetchApi =() => {
    return fs.readFile("./endpoints.json", 'utf-8')
    .then((data) => {
        return JSON.parse(data)
    });
};

exports.fetchArticleById = (article_id) => {
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

exports.fetchArticles = (topic, sort_by = 'created_at', order = 'desc') => {

    const validOrder = ['asc', 'desc']

    return checkValidTopic(topic)
    .then(() => {
        return checkValidColumn(sort_by)
    }).then(() => {

    if (validOrder.includes(order)){
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
                ORDER BY ${sort_by} ${order};`
           
    return db.query(query, queryParams)
        .then((result) => {
            return result.rows;
    })
    } else {
             return Promise.reject()
            }
    })
};

exports.fetchArticleComments = (article_id) => {
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

exports.addComment = (article_id, comment) => {
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

exports.updateArticles = (article_id, incVotes) => {
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

exports.removeComment = (comment_id) => {
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

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users').then(({rows}) => {
        return rows;
    });
}

exports.fetchUsersByUsername = (username) => {
   
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'Username does not exist'})
        } else {
             return result.rows[0];
        }
    });
}

exports.updateComments = (comment_id, incVotes) => {
    const query = `UPDATE comments
                    SET votes = votes + $1
                    WHERE comment_id = $2
                    RETURNING *`
    
    return db.query(query, [incVotes, comment_id])
    .then((result) =>  {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'comment_id does not exist'})
        }
        return result.rows[0]
    })
}


