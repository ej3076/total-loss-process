'use strict';

const { TransactionProcessor } = require('sawtooth-sdk/processor');
const VehicleHandler = require('./handler');

if (!process.argv[2]) {
  throw new Error('missing validator address');
}

const url = new URL(process.argv[2]);

if (url.protocol !== 'tcp:') {
  throw new Error('validator address must use tcp protocol');
}

const processor = new TransactionProcessor(url.href);

processor.addHandler(new VehicleHandler());

processor.start();
