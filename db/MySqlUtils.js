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

mysqlInstance.async = {}
mysqlInstance.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        mysqlInstance.query(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}
module.exports = { mysqlInstance }