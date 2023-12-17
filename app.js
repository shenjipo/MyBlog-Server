const express = require('express')
const app = express()
const ws = require('./service/ws')
app.use(express.json())
const multer = require("multer")
const update = multer({
    dest: "./assets/upload/temp"
})
app.use(update.any())


// 设置自动解析token
const { expressjwt: parseJwt } = require('express-jwt')
const SECRET_KEY = 'login2021' // 与生成token的密钥要一致!




//开放跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use("/api", require("./service/login"))
app.use("/api", require("./service/file"))
app.use("/api", require("./service/article"))
app.use("/api", require("./service/account"))






const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})