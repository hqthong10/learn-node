const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();

const router = Router();

router.get("/test", async (ctx, next) => {
  ctx.response.body = "hello word test";
  ctx.response.status = 200;
  ctx.body = "okokok";
});

app.use(async (ctx, next) => {
  ctx.body = "<h1>404</h1>";
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3002, function () {
  console.log("Server running on https://localhost:3002");
});
