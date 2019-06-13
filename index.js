const dotenv = require('dotenv').config();
const express = require('express');
const server = express();
const cookie = require('cookie');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET_KEY;
const forwardingAddress = process.env.FORWARDING_ADDRESS;
const scopes = 'write_script_tags';

const shopifyOauth = require('shopify-oauth');
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler();

app.prepare().then(() => {

    server.use(shopifyOauth({
        forwardingAddress, apiKey, apiSecret, scopes
    }, (shop, accessTokenResponse) => {

        const accessToken = accessTokenResponse.access_token;

        request.post(`https://${shop}/admin/script_tags.json`, {
            method: 'post',
            body: JSON.stringify({
                "script_tag": {
                    "event": "onload",
                    "src": process.env.FRONTSTORE_JS
                }
            }),
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'content-type': 'application/json; charset=utf-8'
            },
        });
    }));

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
