const Koa = require("koa");
const app = new Koa();
const serve = require("koa-static");
const path = require("path");
const cors = require("@koa/cors");
const logger = require("koa-logger");

const koaOptions = {
  credentials: true,
  origin: "http://localhost:3000",
  allowHeaders: ["Origin, X-Requested-With, Content-Type, Accept"]
};

app.use(cors(koaOptions));
app.use(logger());
app.use(serve(path.join(__dirname, "public")));

app.use(async ctx => {
  ctx.body = "model host";
});

app.listen(8080);
