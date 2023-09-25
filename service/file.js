const express = require("express")
const router = express.Router()
const fs = require("fs")
const { genid } = require("../db/DbUtils")

router.post("/uploadImg", async (req, res) => {

    if (!req.files) {
        res.send({
            "code": 9999, // 只要不等于 0 就行
            "message": "没有图片"
        })
        return;
    }

    let files = req.files;
    let ret_files = [];

    for (let file of files) {
        //获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        //随机文件名字
        let file_name = file.originalname.split('.')[0] + '_' + genid.NextId().toString() + '.' + file_ext

        //修改名字加移动文件
        fs.renameSync(
            process.cwd() + "/assets/upload/temp/" + file.filename,
            process.cwd() + "/assets/upload/img/" + file_name
        )
        ret_files.push(file_name)
    }


    res.send({
        "code": 200, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], // 图片 src ，必须
        },
        "message": "上传图片成功"
    })

})

router.get("/getImage/:key", async (req, res) => {

    res.sendFile(`/assets/upload/img/${req.params.key}`, {
        root: __dirname + '/../',
        headers: {
            'Content-Type': 'image/jpge',
        }
    }, (error) => {
        console.log(error)
    })

})

module.exports = router