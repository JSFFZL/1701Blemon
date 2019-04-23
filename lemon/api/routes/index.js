var express = require('express');
var router = express.Router();
var mongo=require("mongodb-curd");


var db="1701Blemon";
var user="user";
var bill = "bill";
var classify = "classify";
var icon = "icon";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//登录接口
/*
*关键：登录要查询数据库里面的当前这个数据，把登录成功后的唯一_id返回给用户，用户接收到操作
 */
router.post('/api/login', function(req, res, next) {
  var name = req.body.username;
  var password = req.body.password;
  mongo.find(db,user,{"name":name,"pwd":password},function(result){
    if(!result){
      res.json({
        code:0,
        msg:"error"
      })
    }else{
      if(result.length > 0){
        /*
        *为了用户的安全，把密码给过滤掉
        *筛选出需要返回的数据,
         */
        let obj = {
          id:result[0]._id,
          name:result[0].name
        }
        res.json({
          code:1,
          msg:"success",
          data:obj
        })
      }else{
        res.json({
          code:3,
          msg:"用户不存，用户名或者密码不匹配！"
        })
      }
    
    }
  })
});


/* 根据用户获取当前的账单 */
/*
*关键：要根据用户的唯一ID号来查询账单，对应uid
 */
router.post('/api/getBill', function(req, res, next) {
  let uid = req.body.uid;
  mongo.find(db,bill,{"uid":uid},function(result){
    if(!result){
      res.json({
        code:0,
        msg:"error"
      })
    }else{
      res.json({
        code:1,
        msg:"ok",
        data:result
      })
    }
  })
});


/* 删除账单 */
/*
*关键：根据数据的唯一 “_id” 来删除数据，删除就是使用唯一的数据_id 
 */
router.post('/api/deltBill', function(req, res, next) {
  let id = req.body.id;
  mongo.remove(db,bill,{"_id":id},function(result){
    if(!result){
      res.json({
        code:0,
        msg:"删除失败！"
      })
    }else{
      res.json({
        code:1,
        msg:"删除成功！",
        data:result
      })
    }
  })

});





module.exports = router;
