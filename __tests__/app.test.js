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

describe.only('/api', ()    =>  {
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
