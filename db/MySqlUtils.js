const mysql = require('mysql') // 引入 mysql

// 配置连接项
const mysqlInstance = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '15896302145.sa',
    port: '3306',
    database: 'blog'
})

// 执行连接操作
mysqlInstance.connect()

module.exports = { mysqlInstance }