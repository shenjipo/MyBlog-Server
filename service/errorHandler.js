function errorHandler(err, req, res, next) {
    console.log(err, err.name);
    let code = 403;
    let message = 'user forbidden';
    // token解析的错误
    if (err.name === 'UnauthorizedError') {
        code = 401
        message = 'no login'
    }
    res.statusCode = code;
    res.send({
        status: code,
        message,
    })
}

module.exports = errorHandler

