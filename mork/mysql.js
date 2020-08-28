const mysql=require('mysql');

const connect=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port : 3306,
    database : 'project2'
})

connect.connect();


module.exports.sqlquery=function(sql,data,cb){
    connect.query(sql,data,(err,result)=>{
        if(err) throw err;
        cb&&cb(result)
    })
}
module.exports.connect=connect