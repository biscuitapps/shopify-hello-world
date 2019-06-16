const dotenv = require('dotenv').config();
const express = require('express')();

const dev = process.env.NODE_ENV !== 'production'

const next = require('next');
const nextApp = next({ dev, dir: './public' })
const nextHandle = nextApp.getRequestHandler();

const shopifyOauth = require('./routes/oauth.js');
const shopifyProxy = require('./routes/proxy.js');

nextApp.prepare().then(() => {

    express.use(shopifyOauth);
    express.use(shopifyProxy);

    express.get('*', (req, res) => {
        return nextHandle(req, res)
    })

    const port = parseInt(process.env.PORT, 10) || 3000;
    express.listen(port, () => {
      console.log(`Hello World App listening on port ${port}!`);
    });
});
