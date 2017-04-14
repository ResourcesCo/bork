const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const static = require('koa-static');
const router = require('koa-route');
const superagent = require('superagent');

const app = new Koa();
app.use(static('./build'));
app.use(bodyParser());
app.use(json());

function headerArray(headers) {
  const arr = [];
  for (const name in headers) {
    if (Array.isArray(headers[name])) {
      headers[name].forEach((value) => {
        arr.push({name, value});
      });
    } else {
      arr.push({name, value: headers[name]});
    }
  }
  return arr;
}

app.use(router.post('/api/requests', async (ctx) => {
  try {
    const {method, url, headers, body} = ctx.request.body;
    const apiReq = superagent(method, url).timeout({
      response: 5000,  // Wait 5 seconds for the server to start sending,
      deadline: 60000, // but allow 1 minute for the file to finish loading.
    });
    headers.forEach(header => {
      apiReq.set(header.name, header.value);
    });
    if (!['GET', 'HEAD', 'DELETE'].includes(method) || (body && body !== '')) {
      apiReq.send(body || '');
    }
    const apiResp = await apiReq;
    ctx.status = 200;
    ctx.body = {
      status: apiResp.status,
      headers: headerArray(apiResp.headers),
      body: apiResp.body,
    };
  } catch (err) {
    console.error('Error making API request:', err);
    ctx.status = 500;
    ctx.body = {error: `Error making API request: ${err}`};
  }
}));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
