const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const fs = require("fs/promises")

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
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string')
            });
          });
        });
    }); 
});

describe('/api', ()    =>  {
    describe('GET', ()   =>   {
        it('Status code 200', () =>  {
            return request(app).get("/api").expect(200);
        });
        it('should respond with an accurate JSON object with avaliable endpoints', ()   => {
            return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
            expect(response.body.endpoint).toEqual(endPoint);
            });
        });
        it('400: should respond with appropriate message when invalid url', ()  =>   {
            return request(app)
            .get("/ap")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request')
            });
        });
    }); 
});

describe("/api/articles/:article_id", () => {
    describe('GET', ()  => {
        it('Status code 200', ()   => {
            return request(app).get("/api/articles/2").expect(200);
        });
        it.only('should respond with an article object containing the appropriate properties corresponding with article_id', ()   => {
            return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then((response) => {
                const article = response.body.article;
                expect(Object.keys(article).length).toBe(8);
                expect(article).toMatchObject({
                    author: 'icellusedkars',
                    title: 'Eight pug gifs that remind me of mitch',
                    article_id: 3,
                    body: 'some gifs',
                    topic: 'mitch',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
                const timestamp = new Date(article.created_at).getTime();
                expect(timestamp).toBe(1604394720000);
            });
        });
    });
});


