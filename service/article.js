const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const { mysqlInstance } = require("../db/MySqlUtils")
const jwt = require('jsonwebtoken');
const jwtScrect = 'login2021';  //签名
const { verifyToken } = require('./authority')

// 新建博客
router.post("/saveBlog", async (req, res) => {
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { title, content, author, createTime, isPreviewShow, uuid } = req.body;
    let id = uuidv4()
    const insert_sql = "INSERT INTO `article`(`id`,`title`,`content`,`author`, `createTime`, `isPreviewShow`, `author_uuid`) VALUES (?,?,?,?,?,?,?)"

    let params = [id, title, content, author, createTime, isPreviewShow, uuid]
    mysqlInstance
    let { err, rows } = await mysqlInstance.async.run(insert_sql, params)

    if (err == null) {
        res.send({
            code: 200,
            data: {
                id: id
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
// 查询博客列表
router.post("/queryBlogList", async (req, res) => {


    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { uuid } = req.body;
    const sql = "select `id`, `title`, `createTime`, `isPreviewShow`, `updateTime` from `article` where `author_uuid` = ?"

    let { err, rows } = await mysqlInstance.async.run(sql, [uuid])
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


// 查询所有博客,但是不包含content数据
router.post("/queryBlogListExceptContent", async (req, res) => {
    let { err, rows } = await mysqlInstance.async.run("select `id`, `title`, `createTime`, `isPreviewShow` from `article` where `isPreviewShow` =?", ['1'])

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

// 根据id查询博客 需要token
router.post("/queryBlogById", async (req, res) => {
    let { id } = req.body;
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { err, rows } = await mysqlInstance.async.run("select * from `article` where `id` = ?", [id])

    if (err == null && rows.length > 0) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: rows[0]
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

})

// 根据id查询博客  不需要token
router.post("/queryBlogByIdNoToken", async (req, res) => {
    let { id } = req.body;

    let { err, rows } = await mysqlInstance.async.run("select * from `article` where `id` = ?", [id])

    if (err == null && rows.length > 0) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: rows[0]
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

})
// 根据id删除博客
router.post("/deleteBlogById", async (req, res) => {
    let { id } = req.body;
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return
    let { err, rows } = await mysqlInstance.async.run("delete from `article` where `id` = ?", [id])

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

// 根据id更新博客
router.post("/updateBlogById", async (req, res) => {
    let { title, content, id, updateTime, isPreviewShow } = req.body;
    let token = req.headers['authorization']
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { err, rows } = await mysqlInstance.async.run("update `article` set `title` = ?, `content` = ?, `updateTime` = ?, `isPreviewShow` = ?  where `id` = ?",
        [title, content, updateTime, isPreviewShow, id])

    if (err === null) {
        res.send({
            code: 200,
            msg: "更新成功",
            data: null
        })
    } else {
        res.send({
            code: 500,
            msg: "更新失败"
        })
    }

})


// 根据id更新博客是否对外显示
router.post("/updateBlogShowById", async (req, res) => {
    let { id, updateTime, isPreviewShow } = req.body;
    let token = req.headers['authorization']
    // 判断权限
    const userInfo = await verifyToken(token, res)
    if (!userInfo) return

    let { err, rows } = await mysqlInstance.async.run("update `article` set `updateTime` = ?, `isPreviewShow` = ?  where `id` = ?",
        [updateTime, isPreviewShow, id])

    if (err === null) {
        res.send({
            code: 200,
            msg: "更新成功",
            data: null
        })
    } else {
        res.send({
            code: 500,
            msg: "更新失败"
        })
    }

})
module.exports = router
