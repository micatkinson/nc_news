# Northcoders News API

The hosted version is avaliable at https://first-web-service-wn9h.onrender.com/api

The project involves building an API for the purpose of accessing application data programatically.  The final API should mimic a real world backend service,
which provides the information to the front end architecture. 

In order to run the program locally, read the following:

Node-postgres will be used to facilitate interactions with the PSQL database. You will require:      
Node.js: ">=6.0.0"
Postgres: "^8.7.3"

Next, you should clone (not fork) the following github repo https://github.com/northcoders/be-nc-news.

Then create a new public GitHub repository where you will push your new code. Create a new branch for each task, pushing the branch to Github on completion of a task, then switching back to the main branch and pulling the changes down.

In order to seed the local database, the enviroment variables need to be configurated. The are two seperate databases, one for testing and one for development. This can be done by creating two .env files for your project: .env.test and .env.development. 

Within these files, assign the corresponding database names, with appropriate information relating to your PostgreSQL setup.

e.g.
env.test 
PGDATABASE = test_db_name

Then, install the dependencies by running npm install in the terminal.

The database can then be seeded by running npm run seed, which uses the script defined in the package.json file.

A script for jest testing is already set up within the package.json file. Testing is already implemented for the pre-made utils, just app testing is required. Husky is installed as a dev dependency to ensure that broken code isn't sent to the repo. If any tests fail during a commit, the commit will be terminated. 

The following endpoints are required:

GET /api/topics
responds with a list of topics

GET /api
responds with a list of available endpoints

GET /api/articles/:article_id
responds with a single article by article_id

GET /api/articles
responds with a list of articles

GET /api/articles/:article_id/comments
responds with a list of comments by article_id

POST /api/articles/:article_id/comments
add a comment by article_id

PATCH /api/articles/:article_id
updates an article by article_id

DELETE /api/comments/:comment_id
deletes a comment by comment_id

GET /api/users
responds with a list of users

GET /api/articles (queries)
allows articles to be filtered and sorted

GET /api/articles/:article_id (comment count)
adds a comment count to the response when retrieving a single article