const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const fs = require("fs/promises")
const { convertTimestampToDate } = require("../db/seeds/utils");

let endPoint;


beforeAll(() => {
        return fs.readFile("./endpoints.json")
        .then((data) => {
            endPoint = JSON.parse(data);
        })
})

beforeEach(() => {
    return seed(data);
})

afterAll(() =>  {
    return db.end();
})

describe('/api/topics', ()    =>  {
    describe('GET', ()   =>   {
        it('Status code 200', () =>  {
            return request(app).get("/api/topics").expect(200);
        });
        it('should respond with an array of topic objects', ()   =>  {
            return request(app)
            .get("/api/topics")
            .then(({body}) => {
            const topics = body.topics;
            expect(Array.isArray(topics)).toBe(true)
            topics.forEach((topic) => {
                expect(Object.keys(topic).length).toBe(2);
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string')
            });
          });
        });
    }); 
});

describe('/api', ()    =>  {
    describe('GET', ()   =>   {
        it('should respond with status 200 and an accurate JSON object with avaliable endpoints', ()   => {
            return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
            expect(response.body.endpoint).toEqual(endPoint);
            });
        });
        it('404: should respond with appropriate message when invalid url', ()  =>   {
            return request(app)
            .get("/ap")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found')
            });
        });
    }); 
});

describe("/api/articles/:article_id", () => {
    describe('GET', ()  => {
        it('should respond with an article object containing the appropriate properties corresponding with article_id and status code 200 when passed accurate endpoint', ()   => {
            return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                const convertTime =  convertTimestampToDate(article.created_at);
                const date = (Object.values(convertTime).join(''))
                expect(Object.keys(article).length).toBe(8);
                expect(article).toMatchObject({
                    author: 'icellusedkars',
                    title: 'Eight pug gifs that remind me of mitch',
                    article_id: 3,
                    body: 'some gifs',
                    created_at: `${date}`,
                    topic: 'mitch',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
        });
        it('404: should respond with appropriate message when endpoint is valid but outlying current article_id', ()   =>  {
            return request(app)
            .get("/api/articles/500")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article_id does not exist");
            });  
        });
        it('400: should respond with appropirate message when endpoint is invalid input',  ()   =>  {
            return request(app)
            .get("/api/articles/five")
            .expect(400)
            .then((response) =>   {
                expect(response.body.msg).toBe('Bad request')
            });
        });
    });
});

describe("/api/articles", () => {
    describe('GET', ()  => {
        it('should respond with an article array of articles object containing the appropriate properties and status code 200 when passed accurate endpoint', ()   => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const { articles } = response.body;
                expect(Array.isArray(articles)).toBe(true)
                articles.forEach((article) => {
                    expect(Object.keys(article).length).toBe(8);
                    expect(typeof article.author).toBe('string');
                    expect(typeof article.title).toBe('string');
                    expect(typeof article.article_id).toBe('number');
                    expect(typeof article.topic).toBe('string');
                    expect(typeof article.created_at).toBe('string');
                    expect(typeof article.votes).toBe('number');
                    expect(typeof article.article_img_url).toBe('string');
                    expect(typeof article.comment_count).toBe('string');
                });
            });
        });
        it('articles should be sorted by date in desc order', ()   => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
            })
        });
    });


describe("/api/articles/:article_id/comments", () => {
    describe('GET', ()  => {
        it('should respond with an array of all comments for given article_id', ()   => {
            return request(app)
            .get("/api/articles/3/comments")
            .expect(200)
            .then((response) => {
                const { comments } = response.body;
                expect(comments).toMatchObject([{
                    comment_id: 11, 
                    votes: 0,
                    created_at: "2020-09-19T23:10:00.000Z",
                    author: "icellusedkars",
                    body: "Ambidextrous marsupial",
                    article_id: 3
                },
                { 
                    comment_id: 10, 
                    votes: 0,
                    created_at: "2020-06-20T07:24:00.000Z",
                    author: "icellusedkars",
                    body: "git push origin master",
                    article_id: 3
                }
                ]);
            });
        });
        it('comments should be sorted by most recent first', ()   => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
            })
        });
        it('404: should respond with appropriate message when article_id is valid but outlying any stored ids', ()   =>  {
            return request(app)
            .get("/api/articles/500/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article_id does not exist");
            });  
        });
        it('400: should respond with appropirate message when parametric article_id is incorrect',  ()   =>  {
            return request(app)
            .get("/api/articles/five")
            .expect(400)
            .then((response) =>   {
                expect(response.body.msg).toBe('Bad request')
            });
        });
    });
    describe('POST', ()  => {
        it('should respond with 201 and add comment for specified article and respond with the posted comment', ()    => {
            return request(app)
            .post("/api/articles/7/comments")
            .send({
                   username: "lurker",
                   body: "Hellllloooooo world!"
                  })
            .expect(201)
            .then((response) => {
                const comment = response.body.addedComment;
                expect(Object.keys(comment).length).toBe(6);
                expect(comment.comment_id).toBe(19)
                expect(comment.author).toBe("lurker");
                expect(comment.body).toBe("Hellllloooooo world!")
                expect(comment.votes).toBe(0)
                expect(comment.article_id).toBe(7)
                expect(typeof comment.created_at).toBe('string')
            });
        });
        it('status code 400 with appropriate message when key is missing from input body', ()    =>   {
        return request(app)
        .post("/api/articles/7/comments")
        .send({
                body: "bodyodyodyody"
             })
        .expect(400)
        .then((response) =>  {
                expect(response.body.msg).toBe('Bad request')
            });
        });
        it('status code 404 when value attributed to foreign key constraint key is a foreign value', ()    =>   {
        return request(app)
        .post("/api/articles/7/comments")
        .send({
            username: "HP",
            body: "Hellllloooooo world!"
           })
        .expect(404)
        .then((response) =>  {
            expect(response.body.msg).toBe('Recieved invalid value')
        });
    });
    it('404: should respond with appropriate message when article_id is valid but outlying any stored ids', ()   =>  {
        return request(app)
        .get("/api/articles/500/comments")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("article_id does not exist");
        });  
    });
    it('400: should respond with appropirate message when parametric article_id is incorrect',  ()   =>  {
        return request(app)
        .get("/api/articles/five")
        .expect(400)
        .then((response) =>   {
            expect(response.body.msg).toBe('Bad request')
        });
    });
});
})
})
  

