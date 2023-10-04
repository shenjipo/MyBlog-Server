const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { mysqlInstance } = require("../db/MySqlUtils")
const jwt = require('jsonwebtoken');
const jwtScrect = 'login2021';  //签名
const verifyToken = require('./login')


router.post("/queryBlogList", async (req, res) => {
    const sql = "select * from `article`"
    mysqlInstance.query(sql, [], (err, res) => {
        if (err) {
            res.send({
                code: 500,
                msg: "查询失败",
                data: rows
            })
        } else {

            res.send({
                code: 200,
                msg: "查询成功",
                data: res
            })
        }
    })
   
})
