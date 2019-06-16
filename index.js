const dotenv = require('dotenv').config();
const express = require('express');
const server = express();
const cookie = require('cookie');
const request = require('request-promise');

const shopifyOauth = require('./routes/oauth.js');

const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './public' })
const handle = app.getRequestHandler();

app.prepare().then(() => {

    server.use(shopifyOauth);

    server.get('/api/:object', (req, res) => {

        const cookies = req.headers.cookie;
        const shop = cookies && cookie.parse(cookies).shopOrigin;
        const accessToken = cookies && cookie.parse(cookies).accessToken;
        const apiObject = req.params.object;

        if (shop && accessToken && apiObject) {
            const shopRequestUrl = `https://${shop}/admin/api/2019-04/${apiObject}.json`;
            const shopRequestHeaders = {
                'X-Shopify-Access-Token': accessToken,
            };

            request.get(shopRequestUrl, { headers: shopRequestHeaders })
                .then((shopResponse) => {
                    res.end(shopResponse);
                })
                .catch((error) => {
                    res.status(error.statusCode).send(error.error.error_description);
                });
        } else {
            res.status(400).send('Required parameters missing');
        }
    });

    server.get('*', (req, res) => {
        return handle(req, res)
    })

    const port = parseInt(process.env.PORT, 10) || 3000;
    server.listen(port, () => {
      console.log(`Hello World App listening on port ${port}!`);
    });
});
