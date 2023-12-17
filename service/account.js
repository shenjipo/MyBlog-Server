const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { mysqlInstance } = require("../db/MySqlUtils")
const { verifyToken } = require('./authority')


// 新建博客
router.post("/queryAccount", async (req, res) => {
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return
    const sql = "select `account`, `password`, `uuid`, `createTime`, `updateTime` from `user`"

    let { err, rows } = await mysqlInstance.async.run(sql, [])
    if (err == null && rows.length > 0) {

        res.send({
            code: 200,
            msg: "查询成功",
            data: rows
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

})

// 创建账号
router.post("/addAccount", async (req, res) => {
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { username, password, createTime } = req.body;
    let uuid = uuidv4()
    const insert_sql = "INSERT INTO `user` (`account`,`password`, `createTime`, `uuid`) VALUES (?,?,?,?)"

    let params = [username, password, createTime, uuid]
    mysqlInstance
    let { err, rows } = await mysqlInstance.async.run(insert_sql, params)

    if (err == null) {
        res.send({
            code: 200,
            data: {
                uuid: uuid
            },
            msg: "添加成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "添加失败",
            data: {}
        })
    }

})

// 删除账号
router.post("/deleteAccount", async (req, res) => {
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { uuid } = req.body;
    let { err, rows } = await mysqlInstance.async.run("delete from `user` where `uuid` = ?", [uuid])

    if (err === null) {
        res.send({
            code: 200,
            msg: "删除成功",
            data: null
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }

})
// 根据uuid修改密码
router.post("/editAccount", async (req, res) => {
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { uuid, password, updateTime } = req.body;
    let { err, rows } = await mysqlInstance.async.run("update `user` set `password` = ?,  `updateTime` = ? where `uuid` = ?",
        [password, updateTime, uuid])

    if (err === null) {
        res.send({
            code: 200,
            msg: "删除成功",
            data: null
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }

})
module.exports = router