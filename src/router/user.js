/*
 * @Author: huhanchi
 * @Date: 2022-03-09 14:14:24
 * @Last Modified by: huhanchi
 * @Last Modified time: 2022-03-09 17:44:51
 */
// 引入koa-router
const KoaRouter = require("koa-router");
const userRouter = new KoaRouter({ prefix: "/user" });
const query = require("./../mysql/db");
const { QUERY_USER } = require("./../mysql/sql");

// user模块的路由中间件
userRouter.get("/getUser", async (ctx) => {
  const data = await query(QUERY_USER);
  ctx.body = {
    code: 200,
    data,
  };
});
/**
 * 登录
 * @username 用户名
 * @password 密码
 * @nickname 昵称
 */
userRouter.post("/login", async (ctx) => {
  const { username, password, nickname } = ctx.request.body;
  const sql = `select username from user where ?`;
  const values = {
    username,
  };

  const data = await query(sql, values);
  ctx.body = {
    data,
  };
});
/**
 * 退出
 */
userRouter.post("/logout", async (ctx) => {
  const { username } = ctx.request.body;
  const sql = `select username from user where ?`;
  const values = {
    username,
  };
  const data = await query(sql, values);
  if (data.username) {
    ctx.cookies.set("username", null);
  }
  ctx.body = {
    msg: "退出成功",
    code: 200,
  };
});
/**
 * 注册
 * @username 用户名
 * @password 密码
 * @nickname 昵称
 */
userRouter.post("/register", async (ctx) => {
  const { username, password, nickname } = ctx.request.body;
  const sql = `insert into user SET ?`;
  const values = {
    username,
    password,
    nickname,
  };
  const data = await query(sql, values);
  if (data.errno === 1062) {
    ctx.body = {
      msg: "用户名重复",
      code: 1062,
    };
    return false;
  }

  ctx.body = {
    msg: "注册成功",
    code: 200,
  };
});

module.exports = userRouter;
