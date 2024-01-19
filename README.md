# Northcoders News API

The hosted version is avaliable at https://first-web-service-wn9h.onrender.com/api

The project involved building an API for the purpose of accessing application data programatically. 

The database used PSQL

To run the project locally, you will need set up the enviroment variables. We have two databases, one for testing and one for development. We can do this by creating two .env files for your project: .env.test and .env.development. 

Within these files, assign the corresponding database names.

e.g.

env.test 
PGDATABASE = test_db_name



Then run a npm install