//GET Method
const express = require("express");
const superagent = require('superagent');

const router = express.Router();

router.get('/api/v1/callback',function(req,res) {
    console.log(req.query);
    return;
});

module.exports = router;