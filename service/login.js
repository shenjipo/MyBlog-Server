const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { db } = require("../db/DbUtils")

const jwt = require('jsonwebtoken')
const SECRET_KEY = 'login2021'

router.post("/login", async (req, res) => {

    let { account, password } = req.body;
    let { err, rows } = await db.async.all("select * from `user` where `account` = ? AND `password` = ?", [account, password])
    console.log(rows, err)
    if (err == null && rows.length > 0) {

        const token = jwt.sign(
            { user: { name: account, password: password } },
            SECRET_KEY,
            { expiresIn: '3h' }
        )
        // let update_token_sql = "UPDATE `user` SET `token` = ? where `id` = ?"

        // await db.async.run(update_token_sql, [login_token, rows[0].id])

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

module.exports = router