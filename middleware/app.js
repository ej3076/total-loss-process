'use strict';

const express = require('express');
const cors = require('cors');
const jwt = require('express-jwt');
// TODO: Use this for scoping endpoints...
// const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

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

// List all vehicles from blockchain
app.get('/vehicles', async (_, res) => {
  try {
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient();

    const resVehicleList = await client.listVehicles();
    console.log(resVehicleList);
    res.send(resVehicleList);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Post a new vehicle to the blockchain
app.post('/vehicles', checkJwt, async (req, res) => {
  try {
    const privateKey = req.headers.private_key;
    if (typeof privateKey !== 'string') {
      throw new Error('Invalid request');
    }
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient(privateKey);

    const newVehicle = {
      vin: req.body.vin,
      color: req.body.color,
      model: req.body.model,
      status: req.body.status,
    };

    const resPostVehicle = await client.createVehicle(newVehicle);
    console.log(resPostVehicle);
    res.send(resPostVehicle);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.use('/keys', require('./routes/keys'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
