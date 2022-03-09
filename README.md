# koa2结合mysql的使用

## 1. 初始化项目

    npm init

## 2. 安装 koa-router、koa-bodyparser、nodemon 插件

    npm i koa-router koa-bodyparser nodemon

## 3. 编写入口文件

    // index.js
    const Koa = require('koa')
    const app = new Koa()

    app.use(async ctx => {
      ctx.body = 'demo'
    })

    app.listen(8999,()=> {
      console.log(`服务运行在http://127.0.0.1:8999`);
    })

## 4. koa-router 路由使用

    // index.js
    const KoaRouter = require("koa-router");
    const router = new KoaRouter();

    router.get("/", async (ctx) => {
      ctx.body = `123`;
    });
    app.use(router.routes());

## 5. 注册用户路由中间件

    // 引入koa-bodyparser
    const KoaBodyParser = require("koa-bodyparser");

    // user模块的路由中间件
    router.post("/user/login", async (ctx) => {
      const { username, password } = ctx.request.body;
      ctx.body = {
        code: 200,
        msg: "登录成功",
        data: {
          username,
          password,
        },
      };
    });
    router.post("/user/register", async (ctx) => {
      const { username, password } = ctx.request.body;
      ctx.body = {
        code: 200,
        msg: "注册成功",
        data: {
          username,
          password,
        },
      };
    });

## 6.拆分路由

    (1) 新建router文件夹，创建index.js(主文件)、user.js(用户模块路由)
    (2) user.js
      // 引入koa-router
      const KoaRouter = require("koa-router");
      const userRouter = new KoaRouter({prefix: '/user'});

      // user模块的路由中间件
      userRouter.post("/login", async (ctx) => {
        const { username, password } = ctx.request.body;
        ctx.body = {
          code: 200,
          msg: "登录成功",
          data: {
            username,
            password,
          },
        };
      });
      userRouter.post("/register", async (ctx) => {
        const { username, password } = ctx.request.body;
        ctx.body = {
          code: 200,
          msg: "注册成功",
          data: {
            username,
            password,
          },
        };
      });

      module.exports = userRouter

    (3) index.js
      // 引入koa-router
      const user = require('./user')
      module.exports = {
        user
      }

    (4) koa入口文件index.js
      // 引入 const { user } = require("./router/index");
      // 使用 app.use(user.routes());

## 7.安装 mysql

    // 安装
    npm i mysql
    // 使用
    const mysql = require("mysql");
    const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "geechat",
    });

    connection.connect();

    connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
    if (error) throw error;
    console.log("The solution is: ", results[0].solution);
    });

    connection.end();

## 8.下载并使用MYSQL
    //下载地址: https://dev.mysql.com/downloads/mysql/

    // 使用管理员打开cmd，执行以下命令
    > mysqld -install // 安装服务
    > mysqld --initialize // 初始化
    > net start mysql // 启动服务
    > mysql -u root -p // 输入密码进入mysql
    ps: 密码可以在安装mysql目录下的data文件夹下的以.err结尾的文件找到
    mysql> alter user 'root'@'localhost' identified by '123456'; // 重置密码

### mysql使用遇到的问题
    1.由于找不到VCRUNTIME140_1.dll，xxx解决方法
      https://blog.csdn.net/BangBrother/article/details/107064968
    2.ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
      // 更改加密方式：修改加密规则为普通模式，默认是严格加密模式
      ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
      // 'password'是你的数据库密码