const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const {getApiResponse} = require('wildcard-api');
require('./api/endpoints');

const server = new Koa();

const router = new Router();

router.all('/wildcard/*', async (ctx, next) => {
  const {method, url, headers} = ctx;
  const context = {method, url, headers};

  const apiResponse = await getApiResponse(context);

  ctx.status = apiResponse.statusCode;
  ctx.body = apiResponse.body;
});

server.use(router.routes());

server.use(Static('client/dist'));

server.listen(process.env.PORT || 3000);