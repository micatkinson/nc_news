const express = require("express")
const Port = 3000
const cors = require('cors')

const { handleCustomErrors, handleBadPsqlErrors, handleInvalidPsqlErrors } = require("./errors.index")



const app = express();

app.use(cors());

app.use(express.json());

const apiRouter = require("./routes/api-router");

app.use('/api', apiRouter)

app.all('*', function (req, res) {
    res.status(404).send({ msg: 'Not Found' })
})

app.use(handleCustomErrors)
app.use(handleBadPsqlErrors)
app.use(handleInvalidPsqlErrors)


module.exports = app;