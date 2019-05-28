const dotenv = require('dotenv').config();
const express = require('express');
const server = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const forwardingAddress = process.env.FORWARDING_ADDRESS;
const scopes = 'write_script_tags';

const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler();

app.prepare().then(() => {

    server.get('/shopify', (req, res) => {
        const shop = req.query.shop;
        if (shop) {
            const state = nonce();
            const redirectUri = forwardingAddress + '/shopify/callback';
            const installUrl = 'https://' + shop +
                '/admin/oauth/authorize?client_id=' + apiKey +
                '&scope=' + scopes +
                '&state=' + state +
                '&grant_options[]=per-user' +
                '&redirect_uri=' + redirectUri;

            res.cookie('state', state);
            res.redirect(installUrl);
        } else {
            return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
        }
    });

    server.get('/shopify/callback', (req, res) => {

        const { shop, hmac, code, state } = req.query;
        const stateCookie = cookie.parse(req.headers.cookie).state;

        if (state !== stateCookie) {
            return res.status(403).send('Request origin cannot be verified');
        }

        if (shop && hmac && code) {
            const map = Object.assign({}, req.query);
            delete map['signature'];
            delete map['hmac'];
            const message = querystring.stringify(map);
            const providedHmac = Buffer.from(hmac, 'utf-8');
            const generatedHash = Buffer.from(
                crypto
                    .createHmac('sha256', apiSecret)
                    .update(message)
                    .digest('hex'),
                'utf-8'
            );
            let hashEquals = false;
            // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
            try {
                hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
                // timingSafeEqual will return an error if the input buffers are not the same length.
            } catch (e) {
                hashEquals = false;
            };

            if (!hashEquals) {
                return res.status(400).send('HMAC validation failed');
            }

            const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            };

            request.post(accessTokenRequestUrl, { json: accessTokenPayload })
                .then((accessTokenResponse) => {

                    const accessToken = accessTokenResponse.access_token;
                    const locale = accessTokenResponse.associated_user.locale;

                    res.cookie('accessToken', accessToken);
                    res.cookie('locale', locale);
                    res.cookie('shopOrigin', shop);

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

                    res.redirect('/');
                })
                .catch((error) => {
                    console.log(error);
                    res.status(error.statusCode).send(error.error_description);
                });

        } else {
            res.status(400).send('Required parameters missing');
        }
    });

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

    server.listen(3000, () => {
      console.log('Hello World App listening on port 3000!');
    });
});
