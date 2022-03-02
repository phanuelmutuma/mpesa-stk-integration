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


### README
- [ ] Copy `example-README.md` from this repository to your directory.
- [ ] Rename all instances of `<Replace Title>` in README to match the new repo title
- [ ] Manually go through and edit the rest of the README.

### Other Files
- [ ] Copy `CODE_OF_CONDUCT.md` verbatim.
- [ ] Copy `CONTRIBUTING.md` and ensure that you've added any repository-specific instructions. (Replace `<Replace Title>` again).
- [ ] Should you have a `CHANGELOG.md`? Document your release process, if you plan on having one, in the `CONTRIBUTING.md` file.

### Dotfiles
- [ ] Do you need a `.gitignore` file?
- [ ] Do you need an `.npmignore` file?

### License
- [ ] Copy the MIT license from the example repo.
- [ ] Is `Haja Networks Oy` the licensor?
- [ ] Have you added `MIT` as the license in the `package.json`?
- [ ] If you made changes, were these reflected in the last section of the README?

### GitHub Metadata
- [ ] Have you added a short description to the repository?
  - [ ] Is the description matched in the byline under the title in the README?
- [ ] Have you added topics to the GitHub repository: `orbitdb`, `orbit`, and so on?
  - [ ] Have you added these topics as keywords in the `package.json`?

### `package.json`

- [ ] Is the `author` field correct?
- [ ] Have you added `keywords`?
- [ ] Are the `bugs` and `homepage` fields correct?
- [ ] Have you added tests? Are they matched, here?
- [ ] Have you added a `lint` command, if using [`eslint-config-orbitdb`](https://github.com/orbitdb/eslint-config-orbitdb)?

### Tests

- [ ] Are there automated tests?
- [ ] ...for the browser as well?
- [ ] Are those reflected in CI?
- [ ] Bonus points: Using CircleCI workflows to segment tests?
- [ ] Extra bonus points: Are you cross-testing dependencies (i.e. are changes in `orbit-db-keystore` tested in `orbit-db` as well

### Benchmarks
- [ ] Are there benchmarks?
- [ ] Did you run the benchmarks before / after the change or PR?

### Examples
- [ ] Is there an example folder with usage examples?
- [ ] For the browser as well?

## Contribute

If you think this could be better, please [open an issue](https://github.com/orbitdb/repo-template/issues/new)!

Please note that all interactions in [@OrbitDB](https://github.com/orbitdb) fall under our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2022 Haja Networks Oy
