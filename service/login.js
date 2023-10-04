const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { db } = require("../db/DbUtils")
const { mysqlInstance } = require("../db/MySqlUtils")
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'login2021'

router.post("/login", async (req, res) => {

    let { account, password } = req.body;
    const sql = "select * from `user` where `account` = ? AND `password` = ?"
    mysqlInstance.query(sql, [account, password], (err, rows) => {

        if (err == null && rows.length > 0) {
            const token = jwt.sign(
                { user: { name: account, password: password } },
                SECRET_KEY,
                { expiresIn: '3h' }
            )

            let admin_info = rows[0]
            admin_info.password = ""
            console.log('🚀 → token', token)
            res.send({
                code: 200,
                msg: "登录成功",
                data: {
                    user: admin_info,
                    token: token
                }
            })
        } else {
            res.send({
                code: 500,
                msg: "登录失败"
            })
        }
    })



})


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

module.exports = router