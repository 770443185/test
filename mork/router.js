const express = require("express");
const url = require("url");
const router = express.Router();
const qs = require("querystring");
const jwt = require("jsonwebtoken");
const { sqlquery } = require("./mysql");
const { json } = require("body-parser");


// router.post('/test',(req,res)=>{
//   res.send(req.body)
// })

router.get("/goods", async (req, res) => {
  const query = qs.parse(url.parse(req.url).query);
  const size = parseInt(query.size) || 8;
  const page = query.page || 0;
  const sqlStr = "select * from goods LIMIT ?,?";
  sqlquery(sqlStr, [size * page, size], (data) => {
    res.status(200).send(JSON.stringify(data));
  });
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.pwd;
  console.log(req.body);
  const sqlStr = "select * from users where username=? and pwd=?";
  sqlquery(sqlStr, [username, password], (data) => {
    if (data.length == 0) {
      res.send({
        status: 404,
        stateCode: "fail",
        data: [],
        msg: "用户名或者密码错误",
      });
    } else {
      //登录成功
      //将 用户id 存入token
      const token = jwt.sign(
        {
          userId: data[0].userId,
          // 设置一个 2 天有效期的token
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
          name: username,
          pwd: password,
        },
        "liu"
      );
      res.send({
        status: 200,
        stateCode: "success",
        data: [data[0]],
        msg: "登录成功",
        token: token,
      });
    }
  });
});

router.post("/register", (req, res) => {
  const email = req.body.email;
  const user = req.body.username;
  const pwd = req.body.pwd;
  //判断用户名是否存在
  sqlquery("select * from users where username=?", [user], function (data) {
    if (data.length > 0) {
      //用户名存在
      res.status(208).send({
        status: 208,
        msg: "用户名存在",
      });
    } else {
      sqlquery(
        "insert into users (username,pwd,email) values(?,?,?)",
        [user, pwd, email],
        function (resData) {
          if (resData && resData.affectedRows >= 1) {
            //插入成功
            res.status(200).send({
              status: 200,
              msg: "插入成功",
              state: "success",
            });
          } else {
            // 插入失败
            res.status(205).send({
              status: 205,
              msg: "插入失败",
              state: "fail",
            });
          }
        }
      );
    }
  });
});

//检测邮箱是否存在
router.post("/hasemail", (req, res) => {
  const email = req.body.email;
  const sqlStr = "select * from users where email=?";
  sqlquery(sqlStr, [email], function (resData) {
    console.log(resData);
    if (resData.length > 0) {
      //邮箱存在
      res.status(209).send({
        status: 209,
        msg: "邮箱已经被注册",
        state: "fail",
      });
    } else {
      res.status(200).send({
        status: 200,
        msg: "邮箱可以使用",
        state: "success",
      });
    }
  });
});
//获取商品的条数
router.get("/count", (req, res) => {
  sqlquery("select count(*) as 'count' from goods", [], function (data) {
    if (data.length > 0) {
      res.status(200).send({
        status: 200,
        msg: "success",
        count: data[0].count,
      });
    } else {
      res.status(203).send({
        status: 20,
        msg: "fail",
        count: null,
      });
    }
  });
});

router.get("/goodInfo", (req, res) => {
  const goodsId = qs.parse(url.parse(req.url).query).goodsId;
  // res.send(goodsId);
  const sqlStr = "select * from goods where goodsId=?";
  sqlquery(sqlStr, [goodsId - 0], function (data) {
    if (data.length > 0) {
      res.status(200).send({
        status: 200,
        msg: "查询成功",
        state: "success",
        data: data[0],
      });
    } else {
      res.status(206).send({
        status: 206,
        msg: "查询失败",
        state: "fail",
        data: null,
      });
    }
  });
});

// 猜你喜欢
router.get("/related", (req, res) => {
  const size = qs.parse(url.parse(req.url).query).size - 0;
  sqlquery("select count(*) as 'count' from goods", [], (lengthData) => {
    const star = Math.round(Math.random() * (lengthData[0].count - size));
    if (lengthData.length > 0) {
      sqlquery("select * from goods limit ?,?", [star, size], (data) => {
        if (data.length > 0) {
          res.status(200).send({
            status: 200,
            msg: "获取成功",
            state: "success",
            data: data,
          });
        } else {
          res.status(205).send({
            status: 205,
            msg: "获取失败",
            state: "fail",
            data: null,
          });
        }
      });
    } else {
      // 获取
      res.status(204).send({
        status: 204,
        msg: "失败了",
        state: "error",
      });
    }
  });
});

// 用户购物车是否拥有此商品
router.post("/hasgood", (req, res) => {
  const userId = req.body.userId - 0;
  const goodsId = req.body.goodsId - 0;
  const sqlStr = "select * from car where userId=? and goodsId=?";
  sqlquery(sqlStr, [userId, goodsId], function (data) {
    try {
      if (data.length > 0) {
        res.status(200).send({
          status: 200,
          msg: "商品存在购物车中",
          inCart: true,
        });
      } else {
        res.status(200).send({
          status: 200,
          msg: "商品不在购物车中",
          inCart: false,
        });
      }
    } catch (err) {
      res.status(400).send({
        status: 400,
        error: err,
      });
    }
  });
});

router.post("/addCart", (req, res) => {
  const userId = req.body.userId - 0;
  const goodsId = req.body.goodsId - 0;
  const num = req.body.num - 0;
  sqlquery(
    "select * from car where userId=? and goodsId=?",
    [userId, goodsId],
    (isCart) => {
        try{
            if (isCart.length > 0) {
                // 购物车中 已经存在； 存在的话 更新数据
                sqlquery(
                  "update car set num=? where userId=? and goodsId=?",
                  [num, userId, goodsId],
                  (data) => {
                    if (data && data.affectedRows >= 1) {
                      // 修改 成功
                      res.status(200).send({
                        status: 200,
                        msg: "修改成功",
                        state: "success",
                      });
                    } else {
                      //抛出一个错误  让外界 处理
                      throw Error({
                        status: 499,
                        msg: "失败",
                        state: "error",
                      });
                    }
                  }
                );
              } else {
                // 购物车 中不存在  不存在 就添加数据
                sqlquery(
                  "insert into car(goodsId,userId,num) VALUES(?,?,?)",
                  [goodsId, userId, num],
                  (addData) => {
                    if (addData && addData.affectedRows >= 1) {
                      // 插入成功
                      res.status(200).send({
                          status : 200,
                          msg : '操作成功',
                          state : 'success'
                      })
                    } else {
                      //抛出一个错误  让外界 处理
                      throw Error({
                        status: 499,
                        msg: "失败",
                        state: "error",
                      });
                    }
                  }
                );
              }
        }catch(err){
            res.send({
                error : err
            })
        }
    }
  );
});


// 查询用户所有购物车数据
router.get('/usercart',(req,res)=>{
  const userId=qs.parse(url.parse(req.url).query).userId-0;
  const sqlStr='select goods.*,car.userId,car.num from goods,car where car.userId=? and car.goodsId=goods.goodsId';
  sqlquery(sqlStr,[userId],function(data){
    try{
      res.status(200).send({
        status : 200,
        msg : '查询成功',
        data : data,
        state : 'success'
      })
    }catch(err){
      res.status(408).send({
        status : 408,
        msg : '错误',
        state : 'fail'
      })
    }
  })
});


//删除购物车
router.post('/delectcar',(req,res)=>{
  const userId=req.body.userId;
  const goodsId=req.body.goodsId;
  const sqlStr='DELETE from car WHERE goodsId=? and userid=?'
  try{
    sqlquery(sqlStr,[goodsId,userId],data=>{
      
       if(data&&data.affectedRows>=1){
         // 删除成功
          res.status(200).send({
            status : 200,
            msg : '删除成功',
            state : 'success'
          })
       }else{
         //删除失败
         res.status(205).send({
          status : 205,
          msg : '删除失败',
          state : 'fail'
        })
       }
    })
  }catch(err){
    console.log(err);
  }
})
// 更新 商品数量

router.post('/updatecar',(req,res)=>{
  const userId=req.body.userId;
  const goodsId=req.body.goodsId;
  const num=req.body.num;
  const sqlStr='update car set num=? where userId=? and goodsId=?';
  try{
    sqlquery(sqlStr,[num,userId,goodsId],data=>{
      if(data&&data.affectedRows>=1){
        res.status(200).send({
          status : 200,
          msg : '修改成功',
          state : 'success'
        })
      }else{
        res.status(206).send({
          status : 206,
          msg : '修改失败',
          state : 'fail'
        })
      }
    })
  }catch(err){
    console.log(err);
  }
})

module.exports = router;
