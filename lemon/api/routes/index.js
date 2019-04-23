var express = require('express');
var router = express.Router();
var mongo=require("mongodb-curd");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var db="1701Blemon";
var user="user"


//登录接口
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
        *筛选出需要返回的数据
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
module.exports = router;
