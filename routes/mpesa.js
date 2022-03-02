//GET Method
const express = require("express");
const superagent = require('superagent');

const router = express.Router();

const initializeSTKQuery = async (req, res, next) => {
    try {
        const url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
        const url_credentials = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        console.log("Prabably " + req.query.STK_APP_CONSUMER_KEY);
        const auth = 'Basic ' + Buffer.from(req.query.STK_APP_CONSUMER_KEY + ':' + req.query.STK_APP_CONSUMER_SECRET).toString('base64');console.log(auth);
        const response = await superagent.get(url_credentials).set('Authorization', auth);
        const access_token = response.body.access_token;console.log(access_token);
        let hours =  new Date().getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false});

        const timestamp = new Date().getFullYear() + ("0" + (new Date().getMonth() + 1)).slice(-2) + ("0" + new Date().getDate()).slice(-2) + ("0" + new Date().getHours()).slice(-2) + ("0" + new Date().getMinutes()).slice(-2) + ("0" + new Date().getSeconds()).slice(-2);
    
        const password = req.query.STK_APP_SHORTCODE + "9d7b70296640414e9cd2f4679e5584b2acc0afdd38a3177db39972ba26ec1178" + timestamp;console.log(timestamp);
        const password_hash = Buffer.from(password).toString('base64');
        const auth_header = 'Bearer ' + access_token;
        const headers = {
            'Authorization': auth_header,
            'Content-Type': 'application/json',
            'X-Timestamp': timestamp,
            'X-Password': password_hash
        };
        const body = {
            "BusinessShortCode": req.query.STK_APP_SHORTCODE,
            "Password": password_hash,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": "1",
            "PartyA": "254703289762",
            "PartyB": req.query.STK_APP_SHORTCODE,
            "PhoneNumber": "254703289762",
            "CallBackURL": "https://investment.robustlimited.co.ke/index.php",
            "AccountReference": "Test Account",
            "TransactionDesc": "Test Transaction"
        };
        const response_stk = await superagent.post(url).set(headers).send(body);
        console.log(response_stk.body);
        res.status(200).json({
            data: response_stk.body
        });
    } catch (error) {
       // console.log(error);
        res.status(500).json({
            error: error
        });
    }
};


router.get("/api/v1/initialize", initializeSTKQuery);
//router.route("/api/v1/:type/:convert").get(initializeSTKQuery);
//http://localhost:3000/api/v1/callback

module.exports = router;