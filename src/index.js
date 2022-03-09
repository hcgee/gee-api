/*
 * @Author: huhanchi
 * @Date: 2022-03-09 14:14:27
 * @Last Modified by: huhanchi
 * @Last Modified time: 2022-03-09 17:28:04
 */
const Koa = require("koa");
const app = new Koa();
const { user } = require("./router/index");

// 引入koa-bodyparser
const KoaBodyParser = require("koa-bodyparser");
app.use(KoaBodyParser());

// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
app.use(user.routes());

app.listen(8999, () => {
  console.log(`服务运行在http://127.0.0.1:8999`);
});
