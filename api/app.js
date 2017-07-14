const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const router = require('express-promise-router')();
const superagent = require('superagent');

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

router.post('/api/requests', async (req, res) => {
  try {
    const {method, url, headers, body} = req.body;
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
    apiReq.ok(res => res.status);
    const apiResp = await apiReq;
    res.send({
      status: apiResp.status,
      headers: headerArray(apiResp.headers),
      body: apiResp.body,
    });
  } catch (err) {
    console.error('Error making API request:', err);
    res.status(500).send({error: `Error making API request: ${err}`});
  }
});

const app = express();
app.use(morgan('dev'));
app.use(serveStatic('./build'));
app.use(bodyParser.json());
app.use(router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
