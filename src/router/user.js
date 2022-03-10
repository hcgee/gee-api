/*
 * @Author: huhanchi
 * @Date: 2022-03-09 14:14:24
 * @Last Modified by: huhanchi
 * @Last Modified time: 2022-03-10 21:55:32
 */
// 引入koa-router
const KoaRouter = require("koa-router");
const userRouter = new KoaRouter({ prefix: "/user" });
const query = require("./../mysql/db");
const { QUERY_USER } = require("./../mysql/sql");
const { signToken, verifyToken } = require("../utils/token");

// user模块的路由中间件
userRouter.post("/getUser", async (ctx) => {
  const data = await query(QUERY_USER);
  const token = ctx.request.header.token;
  if (!token) {
    ctx.body = {
      code: -1,
      msg: "无效的token",
    };
    return false;
  }
  const isToken = verifyToken(token);
  // const single_token = await query(QUERY_USER);
  if (isToken) {
    ctx.body = {
      code: 200,
      data,
    };
  } else {
    ctx.body = {
      code: -1,
      msg: "token失效",
    };
  }
});
/**
 * 登录
 * @username 用户名
 * @password 密码
 * @nickname 昵称
 */
userRouter.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username) {
    ctx.body = {
      code: 400,
      msg: "用户名为空",
    };
    return false;
  }
  if (!password) {
    ctx.body = {
      code: 400,
      msg: "密码为空",
    };
    return false;
  }
  const user_sql = `select * from user where ?`;
  const user_res = await query(user_sql, { username });
  if (user_res.length > 0) {
    if (user_res[0].password === password) {
      const payload = { username }; //生成token主体信息
      const token = signToken(payload, 3600);
      const set_token_sql = `update user set token=? where username=?`;
      const set_token_res = await query(set_token_sql, [token, username]);
      console.log(set_token_res);
      ctx.body = {
        code: 200,
        msg: "登录成功",
        token,
        username
      };
    } else {
      ctx.body = {
        code: 400,
        msg: "密码不正确",
      };
    }
  } else {
    ctx.body = {
      code: 400,
      msg: "用户名不存在",
    };
  }
});
/**
 * 退出
 */
userRouter.post("/logout", async (ctx) => {
  const { username } = ctx.request.body;
  const sql = `select * from user where ?`;
  const values = {
    username,
  };

  const data = await query(sql, values);
  if (data.length > 0) {
    const clear_token_sql = `update user set token=null where ?`
    const res = await query(clear_token_sql, {username});
    if(!res.errno) {
      ctx.body = {
        msg: "退出成功",
        code: 200,
      };
    }else {
      ctx.body = {
        msg: "退出失败",
        code: 500,
      };
    }
    
  }
  
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
  if (!username) {
    ctx.body = {
      code: 400,
      msg: "用户名为空",
    };
    return false;
  }
  if (!password) {
    ctx.body = {
      code: 400,
      msg: "密码为空",
    };
    return false;
  }
  if (!nickname) {
    ctx.body = {
      code: 400,
      msg: "昵称为空",
    };
    return false;
  }
  const data = await query(sql, values);
  if (data.errno === 1062) {
    ctx.body = {
      code: 1062,
      msg: "用户名重复",
    };
    return false;
  }
  if (!data.errno) {
    ctx.body = {
      code: 200,
      msg: "注册成功",
    };
  }
});

module.exports = userRouter;
