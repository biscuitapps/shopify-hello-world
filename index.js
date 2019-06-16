const dotenv = require('dotenv').config();
const express = require('express');
const server = express();
const next = require('next');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './public' })
const handle = app.getRequestHandler();

const shopifyOauth = require('./routes/oauth.js');
const shopifyProxy = require('./routes/proxy.js');

app.prepare().then(() => {

    server.use(shopifyOauth);
    server.use(shopifyProxy);

    server.get('*', (req, res) => {
        return handle(req, res)
    })

    const port = parseInt(process.env.PORT, 10) || 3000;
    server.listen(port, () => {
      console.log(`Hello World App listening on port ${port}!`);
    });
});
