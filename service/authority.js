const jwt = require('jsonwebtoken');
const jwtScrect = 'login2021';  //签名
const { mysqlInstance } = require("../db/MySqlUtils")

const verifyToken = (token, res) => {

    if (!token) {
        res.send({
            code: 403,
            msg: "用户无权限!",
            data: {}
        })
        return
    }
    let userInfo = null
    try {

        const { user } = jwt.verify(token, jwtScrect)
        userInfo = user

    } catch (err) {
        res.send({
            code: 403,
            msg: "用户无权限!",
            data: {}
        })
        return
    }


    if (!userInfo || !userInfo.name || !userInfo.password) {

        res.send({
            code: 403,
            msg: "用户无权限!",
            data: {}
        })
        return
    }
    const sql = "select * from `user` where `account` = ? AND `password` = ?"

    return new Promise((resolve, reject) => {
        mysqlInstance.query(sql, [userInfo.name, userInfo.password], (err, rows) => {
            if (err || rows.length <= 0) {
                res.send({
                    code: 403,
                    msg: "用户无权限!",
                    data: {}
                })
                reject(null)
            } else {
                resolve(userInfo)
            }
        })
    })

}