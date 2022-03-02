# MPESA Integration Guide (NodeJS with PHP)

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/orbitdb/Lobby) [![Matrix](https://img.shields.io/badge/matrix-%23orbitdb%3Apermaweb.io-blue.svg)](https://riot.permaweb.io/#/room/#orbitdb:permaweb.io) 

> A guide for integrating MPESA API using Node JS and PHP

This repository is meant to serve as an unofficial guide for how to set up the MPESA Daraja API for web and mobile apps. The official documentation can be found [`here`](https://developer.safaricom.co.ke/). The aim of this guide is to provide a much clear path to follow through as the official documentation can be quite hefty.

## Install

These instructions are basic; you can use any language of choice but for the purpose of this guide we'll keep it to NodeJS. Clone the repo to get started

```sh
# Clone the repo.
git clone https://github.com/phanuelmutuma/mpesa-stk-integration

# cd into the folder, ensure you have node installed and run
npm install express morgan body-parser superagent nodemon
```

## Authentication

```sh
 const auth = 'Basic ' + Buffer.from(req.query.STK_APP_CONSUMER_KEY + ':' + req.query.STK_APP_CONSUMER_SECRET).toString('base64');
 const response = await superagent.get(url_credentials).set('Authorization', auth);
 const access_token = response.body.access_token;
```

## Request Sample

`Base64 Encoding` for our password field

```sh
 const password = req.query.STK_APP_SHORTCODE + passkey + timestamp;
 const password_hash = Buffer.from(password).toString('base64');
 const auth_header = 'Bearer ' + access_token;
```

Have a look into the code. We are using router dependency to (obviously) route requests to the API. Reason for using a custom API for this it to call it from any platform (Android, Web, iOS) and also easens the burden of managing urls. However you can choose to run the code directly as a path to a url and call a HTTP request from your development environment.


```sh
# A sample request.
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
     "PartyA": "254708374149",
     "PartyB": req.query.STK_APP_SHORTCODE,
     "PhoneNumber": "254708374149",
     "CallBackURL": "https://domain/callback",
     "AccountReference": "Test Account",
     "TransactionDesc": "Test Transaction"
 };
```

Feel free to check out the rest of the code.


### Simulating

You'll need [`Postman`](https://www.postman.com/) for this! Install it depending on your platform

```sh
# Start the server.
npm start
```

In Postman, ensure you set the environment variables first

![env_variable_postman](http://url/to/img.png)
 
As our host machine acts as the server we use `http://localhost:3000/api/v1/initialize` as the url and set it as a `GET` request

For now you dont' have to worry about `Authentication` as it is already defined in the code. When going live or in Production however, ensure you set authorization paramaters as environment variables

> Remember to change to your phone number in `PartyA` and `PhoneNumber`

If all goes well you should see this

![response](http://url/to/img.png)

and after a few seconds an stk push will be sent to your phone.
 
![stk_push](http://url/to/img.png)




### Response

With your call back url configured properly, ensure you create an index.php file in your file server/manager (if you are using cpanel) or any other hosting provider
it is advised that you create a new folder called `/callback` (Optional name) to better manage your urls, or create a subdomain (Even better). 

The webhook will be sent to our callback url. To receive the json response our php file should look like this


```sh
<?php

header("Content-Type:application/json");

if (!$request=file_get_contents('php://input')) {
 echo "Invalid input"; 
 exit();
} 

$json_data = json_decode($request, true);

# Print the output which you obviously will never see it :) but you can save it to your database (MYSQL)
echo 'Amount =' . $json_data['Body']['stkCallback']['CallbackMetadata']['Item'][0]['Value']."<br>";
echo 'MpesaReceiptNumber =' .$json_data['Body']['stkCallback']['CallbackMetadata']['Item'][1]['Value']."<br>";
echo 'TransactionDate =' .$json_data['Body']['stkCallback']['CallbackMetadata']['Item'][3]['Value']."<br>";
echo 'PhoneNumber =' .$json_data['Body']['stkCallback']['CallbackMetadata']['Item'][4]['Value']."<br>";

# Save the data to you database
 $sql="INSERT INTO mpesa_payments( 
     Amount,
     MpesaReceiptNumber,
     TransactionDate,
     PhoneNumber
 )  
 VALUES  
 ( 
     '$amount',
     '$mpesareceipt', 
     '$transactiondate', 
     '$phonenumber'
 )";

# You can also save the json response as a json file
$file = fopen('data.json','w');  
fwrite($file, $request);
fclose($file);

# and read the file later when you directly call the url
$json = file_get_contents('data.json');
$json_data = json_decode($json, true);

echo 'Amount =' . $json_data['Body']['stkCallback']['CallbackMetadata']['Item'][0]['Value']."<br>";
echo 'MpesaReceiptNumber =' .$json_data['Body']['stkCallback']['CallbackMetadata']['Item'][1]['Value']."<br>";
echo 'TransactionDate =' .$json_data['Body']['stkCallback']['CallbackMetadata']['Item'][3]['Value']."<br>";
echo 'PhoneNumber =' .$json_data['Body']['stkCallback']['CallbackMetadata']['Item'][4]['Value']."<br>";

?>
```

Aaaand... Thats it.


## Deployment and Integration

I recommend [`Heroku`](https://www.heroku.com/) as a go to for hosting your API and node files. This will cost you some time however as you may need to also integrate Git for CI/CD but it will be worth it.

This is also not the only option. The faster option is to use URLs. You can initialize the request from a REST API client on your preferred platform. For Web you can use Express and Router (NodeJS) and many others. Androi we have Volley and the like. Feel free to look out for more.

The Callback however should be a URL (as the mpesa STK requires a fully qualified domain name) so running the callback on localhost won't work.


## Contribute

If you think this could be better, or facing an issue please [open an issue](https://github.com/phanuelmutuma/mpesa-stk-integration/issues/new)!

Please note that all interactions in [@Phanuel Mutuma](https://github.com/phanuelmutuma) fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2022 Phanuel Mutuma
