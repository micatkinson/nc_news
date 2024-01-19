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
                expect(article).toMatchObject({
                    author: 'icellusedkars',
                    title: 'Eight pug gifs that remind me of mitch',
                    article_id: 3,
                    body: 'some gifs',
                    created_at: date,
                    topic: 'mitch',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                });
            });
        });
        it('should respond with an article object with additional comment_count variable', ()   => {
            return request(app)
            .get("/api/articles/5")
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                expect(Object.keys(article).length).toBe(9);
                expect(article.comment_count).toEqual('2')
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
    describe('Patch', ()   => {
        it('200 should update the selected article and return updated article when positive integer in body',   ()   =>  {
            return request(app)
            .patch("/api/articles/1")
            .send({ 
                inc_votes: 50
            })
            .expect(200)
            .then((response) =>  {
                const { updatedArticle } = response.body
                const convertTime =  convertTimestampToDate(updatedArticle.created_at);
                const date = (Object.values(convertTime).join(''))
                expect(Object.keys(updatedArticle).length).toBe(8);
                expect(updatedArticle).toMatchObject({
                    author: 'butter_bridge',
                    title: 'Living in the shadow of a great man',
                    article_id: 1,
                    body: 'I find this existence challenging',
                    created_at: date,
                    topic: 'mitch',
                    votes: 150,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })

        });
        it('200 should update the selected article and return updated article when negative integer in body',   ()   =>  {
            return request(app)
            .patch("/api/articles/1")
            .send({ 
                inc_votes: - 50
            })
            .expect(200)
            .then((response) =>  {
                const { updatedArticle } = response.body
                const convertTime =  convertTimestampToDate(updatedArticle.created_at);
                const date = (Object.values(convertTime).join(''))
                expect(updatedArticle).toMatchObject({
                    author: 'butter_bridge',
                    title: 'Living in the shadow of a great man',
                    article_id: 1,
                    body: 'I find this existence challenging',
                    created_at: date,
                    topic: 'mitch',
                    votes: 50,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
        });
        it('400: should respond if value given in incorrect format', ()  =>  {
            return request(app)
            .patch("/api/articles/4")
            .send({ 
                inc_votes: 'five'
            })
            .expect(400)
            .then((response) =>  {
                expect(response.body.msg).toBe('Bad request')
            })
        });
        it('400: should respond if given incorrect key', ()   =>  {
            return request(app)
            .patch("/api/articles/4")
            .send({
                dec_votes: 1
            })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        })
        it('400: should respond if given additional keys', ()   =>  {
            return request(app)
            .patch("/api/articles/4")
            .send({
                inc_votes: 1,
                comment: "updated info"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
        });
        it('404: should respond with appropriate message when endpoint is valid but outlying current article_id', ()   =>  {
            return request(app)
            .patch("/api/articles/500")
            .send({ 
                inc_votes: -50
            })
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article_id does not exist");
            });  
        });
        it('400: should respond with appropirate message when endpoint is invalid input',  ()   =>  {
            return request(app)
            .patch("/api/articles/five")
            .send({ 
                inc_votes: -50
            })
            .expect(400)
            .then((response) =>   {
                expect(response.body.msg).toBe('Bad request')
            });
        });
    });
 })

describe("/api/articles", () => {
    describe('GET', ()  => {
        it('should respond with an article array of articles object containing the appropriate properties and status code 200 when passed accurate endpoint', ()   => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const { articles } = response.body;
                const articleObj = expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
                articles.forEach((article) => {
                    expect(Object.keys(article).length).toBe(8)
                    expect(article).toEqual(articleObj)
                });
            })
        });
        it('articles should be sorted by date in desc order', ()   => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
            })
        });
        it('should accept a topic query and filter the articles depending on topic value specified', ()  => {   
            return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then((response) => {
                const { articles } = response.body;
                articles.forEach((article) => {
                    expect(article.topic).toBe("mitch")
                });
            })
        });
        it('should respond with an empty array if known topic but topic has no articles', ()  => {
            return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then((response) =>  {
                expect(response.body.articles.length).toBe(0)
            })
        });
        it('should respond with all articles if endpoint ommitteed', ()  => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) =>  {
                expect(response.body.articles.length).toBe(data.articleData.length)
            })
        });
        it('404 not found when an unknown topic is selected', ()   => {
            return request(app)
            .get("/api/articles?topic=food")
            .expect(404)
            .then((response) =>  {
                expect(response.body.msg).toBe('Topic does not exist')
            });
        });
        it('200: should accept sort_by and order by queries', ()   => {
            return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toBeSortedBy('title', {descending: false})
            })
        });
        it('404: should respond when column does not exist', ()   =>  {
            return request(app)
            .get("/api/articles?sort_by=speed")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Column does not exist')
            })
        });
        it('404: should respond when invalid sort query', ()   =>  {
            return request(app)
            .get("/api/articles?sort_by=title&order=up")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found');
            })
        })
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
            });
        });
        it('should return 200 status and empty array if valid article_id but no comments', ()   => {
            return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then((response) =>  {
                const { comments } = response.body;
                expect(comments).toMatchObject({})
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
                const convertTime =  convertTimestampToDate(comment.created_at);
                const date = (Object.values(convertTime).join(''))
                const currentTime = new Date()
                expect(Object.keys(comment).length).toBe(6);
                expect(comment).toMatchObject({
                    article_id: 7,
                    author: "lurker",
                    body: "Hellllloooooo world!",
                    comment_id: 19,
                    created_at: date,
                    votes: 0  
                });
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
        it('status code 404 when username is not found in the users table', ()    =>   {
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
        .post("/api/articles/500/comments")
        .send({
            username: "lurker",
            body: "Hellllloooooo world!"
           })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Recieved invalid value");
        });  
    });
    it('404: should respond with appropirate message when parametric article_id is incorrect',  ()   =>  {
        return request(app)
        .post("/api/articles/five")
        .send({
            username: "lurker",
            body: "Hellllloooooo world!"
           })
        .expect(404)
        .then((response) =>   {
            expect(response.body.msg).toBe('Not Found')
        });
    });
});
})
})

describe("/api/comments/:comment_id", ()   =>   {
    describe('DELETE', ()   =>  {
        it('204 status code and no content when successful',  ()   =>  {
            return request(app)
            .delete("/api/comments/3")
            .expect(204)
            .then((response) => {
                expect(response.body).toEqual({});
            });
        });
        it('404 status and comment_id not found msg when valid but non-existant comment_id inputted', ()   =>  {
            return request(app)
            .delete("/api/comments/100")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("comment_id not found")
            })
        })
        it('400 status code if invalid comment_id inputted', ()  =>  {
            return request(app)
            .delete("/api/comments/six")
            .expect(400)
            .then((response) =>  {
                expect(response.body.msg).toBe("Bad request")
            })

        })
    });
});

describe("api/users", ()   =>   {
    describe('GET',  ()   =>  {
        it('200 status code and array of user objects',  ()  =>  {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) =>  {
                const { users } = response.body
                const userObj = expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
                users.forEach((user) => {
                    expect(Object.keys(user).length).toBe(3)
                    expect(user).toEqual(userObj)
                });
            });
        });
    });
})

describe("api/users/:username", ()   =>   {
    describe('GET', ()   =>  {
         it('200: should accept username input and return user object of specified user',  ()  =>  {
                return request(app)
                .get("/api/users/rogersop")
                .expect(200)
                .then((response) =>  {
                    const user = response.body.user;
                    expect(user).toMatchObject({
                        username: 'rogersop',
                        name: 'paul',
                        avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                    })
                })
            });
            it('404: should respond with appropriate message when username does not exist within data', ()   =>  {
                return request(app)
                .get("/api/users/bob123'")
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("Username does not exist");
                });  
            });
        });
    })
