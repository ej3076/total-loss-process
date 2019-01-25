"use strict";

const { TransactionProcessor } = require("sawtooth-sdk/processor");

const VehicleHandler = require("./handler");

const processor = new TransactionProcessor("http://validator:4004");

processor.addHandler(new VehicleHandler());

processor.start();
