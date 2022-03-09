/*
 * @Author: huhanchi
 * @Date: 2022-03-09 14:14:17
 * @Last Modified by: huhanchi
 * @Last Modified time: 2022-03-09 16:41:17
 */
const mysql = require("mysql");
const config = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "geechat",
};

let pools = {};

//判断是否存在连接池不用每次都创建
if (!pools.hasOwnProperty("data")) {
  pools["data"] = mysql.createPool(config);
}

// 查询
// sql 是sql语句
// values 是sql语句中的具体值
// sql values 可查看官方文档 https://github.com/mysqljs/mysql#performing-queries
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    //初始化连接池
    pools["data"].getConnection((err, connection) => {
      if (err) {
        console.log(err, "数据库连接失败");
      } else {
        console.log("数据库连接成功");
        //操作数据库
        connection.query(sql, values, (err, results) => {
          if (err) {
            resolve(err);
          } else {
            connection.release();
            resolve(results);
          }
        });
      }
    });
  });
};

module.exports = query;
