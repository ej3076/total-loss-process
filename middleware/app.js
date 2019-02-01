'use strict';
const express = require('express');
const cors = require('cors');
const VehicleClient = require('./lib/vehicle-client');

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

app.use('/keys', require('./routes/keys'));

app.listen(PORT, () =>
  console.log(`Server listening on port ${IS_PRODUCTION ? PORT : '8080'}.`),
);

(async () => {
  const client = new VehicleClient(
    'b2ac25d22f41f72fcc0ffd57e69285db485944e3bfd1e5534c8a9930a41b43cf',
  );
  const vehicle = {
    vin: '67890',
    color: 'yellow',
    model: 'coupe',
    status: 0,
  };
  var response = await client.createVehicle(vehicle);
  console.log(response);

  // var response1 = await client.editVehicle({ vin: vehicle.vin, color: 'blue' });
  // console.log(response1);

  // var response2 = await client.getVehicle(vehicle.vin);
  // console.log(response2);

  var response3 = await client.listVehicles();
  console.log(response3);
})();
