'use strict';

const express = require('express');
const cors = require('cors');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
// TODO: Use this for scoping endpoints...
// const jwtAuthz = require('express-jwt-authz');

const ClaimClient = require('./lib/claim-client');

const PORT = process.env.PORT || 8080;

const app = express();

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: false,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://total-loss-process.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: 'https://total-loss-process.auth0.com/api/v2/',
  issuer: `https://total-loss-process.auth0.com/`,
  algorithms: ['RS256'],
});

app.use(express.json());
app.use(cors());

// Insert a new claim into the blockchain.
app.post('/claims', checkJwt, async (req, res) => {
  try {
    const privateKey = req.headers.private_key;
    if (typeof privateKey !== 'string') {
      throw new Error('Invalid request');
    }
    const client = new ClaimClient(privateKey);
    const response = await client.createClaim(req.body);
    console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Edit an existing claim on the blockchain using VIN.
app.post('/claims/:vin', checkJwt, async (req, res) => {
  try {
    const privateKey = req.headers.private_key;
    if (typeof privateKey !== 'string') {
      throw new Error('Invalid request');
    }
    const client = new ClaimClient(privateKey);
    const response = await client.editClaim(req.body);
    console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Retrieve a claim from the blockchain using VIN.
app.get('/claims/:vin', async (req, res) => {
  try {
    const vin = req.params.vin;
    const client = new ClaimClient();
    const claimList = await client.getClaim(vin);
    console.log(claimList);
    res.send(claimList);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Retrieve a list of claims from the blockchain.
app.get('/claims', async (_, res) => {
  try {
    const client = new ClaimClient();
    const claimsList = await client.listClaims();
    console.log(claimsList);
    res.send(claimsList);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.use('/keys', require('./routes/keys'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
