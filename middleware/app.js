'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const http = require('http');

const PORT = process.env.PORT || 8080;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/', function(_, res) {
  res.send(`GET request homepage - localhost:${PORT}`);
});

app.post('/', function(_, res) {
  res.send(`POST request homepage - localhost:${PORT}`);
});

app.put('/', function(_, res) {
  res.send(`PUT request homepage - localhost:${PORT}`);
});

app.delete('/', function(_, res) {
  res.send(`DELETE request homepage - localhost:${PORT}`);
});

// List all vehicles from blockchain
app.get('/vehicles', function(req, res) {
  (async () => {
    const privateKey = req.headers.authorization;
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient(
      privateKey,
    );
  
    const resVehicleList = await client.listVehicles();
    console.log(resVehicleList);
    res.send(resVehicleList);
  })();
});

// Post a new vehicle to the blockchain
app.post('/vehicles', function(req, res) {
  (async () => {
    const privateKey = req.headers.authorization;
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient(
      privateKey,
    );
  
    const newVehicle = {
      vin: req.body.vin,
      model: req.body.model,
      color: req.body.color,
      status: req.body.status,
    };
  
    const resPostVehicle = await client.createVehicle(newVehicle);
    console.log(resPostVehicle);
    res.send(resPostVehicle);
  })();
});

app.use('/keys', require('./routes/keys'));

app.listen(PORT, () =>
  console.log(`Server listening on port ${IS_PRODUCTION ? PORT : '8080'}.`),
);