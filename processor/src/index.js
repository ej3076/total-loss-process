'use strict';

const { TransactionProcessor } = require('sawtooth-sdk/processor');
const VehicleHandler = require('./handler');

if (!process.argv[2]) {
  console.error('missing validator address');
  process.exit(1);
}
const url = new URL(process.argv[2]);

if (url.protocol !== 'tcp:') {
  console.error('validator address must use tcp protocol');
  process.exit(1);
}

const processor = new TransactionProcessor(url.href);

processor.addHandler(new VehicleHandler());

processor.start();
