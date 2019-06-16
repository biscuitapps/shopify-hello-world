const request = require('request-promise');
const cookie = require('cookie');
const express = require('express')
const router = express.Router()

router.get('/api/:object', (req, res) => {

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

module.exports = router;
