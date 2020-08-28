module.exports = (req, res, next) => {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", 'http://127.0.0.1:5500');
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "x-requested-with,content-type");
  //跨域允许的请求方式
  // 允许 携带cookie
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,request-origin");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") {
    res.sendStatus(200);
  } else {
    next();
  }
};
