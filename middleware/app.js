'use strict';
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.json());
app.use(cors());

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
app.get('/vehicles', function(_, res) {
  (async () => {
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient(
    // this is a private key that you will be receiving from the frontend... 
      '76af78540ac06532de1aaa2b42bb55d2130f29a0488e0f297df6b6482c3f54d9',
    );
  
    const resVehicleList = await client.listVehicles();
    console.log(resVehicleList);
    res.send(resVehicleList);
    //res.sendStatus(200);
  })();
});

// List vehicle from blockchain by VIN
app.get('/vehicles/:vin', function(req, res) {
  var vinNum = req.params.vin;

  (async () => {  
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient(
    // this is a private key that you will be receiving from the frontend... 
      '76af78540ac06532de1aaa2b42bb55d2130f29a0488e0f297df6b6482c3f54d9',
    );

    const vehicle1 = {
      vin: vinNum,
      color: 'red',
      model: 'sedan',
      status: 0,
    };

    const resVehicleData = await client.getVehicle(vehicle1.vinNum);
    console.log(resVehicleData);
    res.send(resVehicleData);
  })();
});

// Post a new vehicle to the blockchain
app.post('/vehicles/:vin', function(req, res) {
  var vinNum = req.params.vin;

  (async () => {
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient(
    // this is a private key that you will be receiving from the frontend... 
      '76af78540ac06532de1aaa2b42bb55d2130f29a0488e0f297df6b6482c3f54d9',
    );
  
    const vehicle1 = {
      vin: vinNum,
      color: 'red',
      model: 'sedan',
      status: 0,
    };
  
    const resPostVehicle = await client.createVehicle(vehicle1);
    console.log(resPostVehicle);
    res.send(resPostVehicle);
  })();
});

// Edit vehicle data on the blockchain by VIN
app.put('/vehicles/:vin', function(req, res) {
  var vinNum = req.params.vin;
  
  (async () => {
    const VehicleClient = require('./lib/vehicle-client.js');
    const client = new VehicleClient(
    // this is a private key that you will be receiving from the frontend... 
      '76af78540ac06532de1aaa2b42bb55d2130f29a0488e0f297df6b6482c3f54d9',
    );
  
    const vehicle1 = {
      vin: vinNum,
    };

    const resEditVehicle = await client.editVehicle(vehicle1.vin, { color: 'yellow' });
    console.log(resEditVehicle);
    res.send(resEditVehicle);
  })();
});

app.use('/keys', require('./routes/keys'));

app.listen(PORT, () =>
  console.log(`Server listening on port ${IS_PRODUCTION ? PORT : '8080'}.`),
);