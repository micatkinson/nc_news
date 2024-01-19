
exports.handleCustomErrors = ((err, req, res, next) =>  {
    if (err.status === 404){
        res.status(404).send({msg: err.msg})
    } else {
        next(err);
    };
});


exports.handleBadPsqlErrors = ((err, req, res, next) =>   {
    if (err.code === '22P02' || err.code === '23502'){
        res.status(400).send({msg: 'Bad request'})
    } else {
        next(err);
    };
});

exports.handleInvalidPsqlErrors = ((err, req, res, next) =>  {
    if (err.code === '23503'){
            res.status(404).send({msg: 'Recieved invalid value'})
    }
})