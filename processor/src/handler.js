"use strict";

const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");
const exceptions = require("sawtooth-sdk/processor/exceptions");

const { VEHICLE_FAMILY, VEHICLE_NAMESPACE } = require("./constants");
const VehicleState = require("./state");

/**
 * @typedef {import('sawtooth-sdk/processor/context')} Context Sawtooth context.
 */

module.exports = class VehicleHandler extends TransactionHandler {
  constructor() {
    super(VEHICLE_FAMILY, ["1.0"], [VEHICLE_NAMESPACE]);
  }

  /**
   * Main sawtooth transaction handler.
   *
   * @param {unknown} transactionProcessRequest
   * @param {Context} context
   */
  apply(transactionProcessRequest, context) {
    const state = new VehicleState(context);
    throw new Error("Need to finish implementation...");
  }
};
