const express = require("express")
const router = express.Router()
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


module.exports = router