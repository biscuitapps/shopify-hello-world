const shopifyOauth = require('shopify-oauth');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET_KEY;
const forwardingAddress = process.env.FORWARDING_ADDRESS;
const scopes = 'write_script_tags';

module.exports = shopifyOauth({
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
});
