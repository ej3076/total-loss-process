'use strict';

const cbor = require('cbor');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { KNOWN_ACTIONS } = require('./constants');

/**
 * @typedef {import('./state').Vehicle} Vehicle
 * @typedef {Partial<import('./state').Vehicle> & { vin: string }} PartialVehicle
 */

class VehiclePayload {
  /**
   * Constructor.
   *
   * @param {string} action       - An action to perform.
   * @param {PartialVehicle} data - Data associated with the action.
   */
  constructor(action, data) {
    this.action = action;
    this.data = data;
  }

  /**
   * VehiclePayload builder.
   *
   * @param {Buffer} payload - Raw payload buffer.
   * @return {Promise<VehiclePayload>}
   */
  static async fromBytes(payload) {
    const { action, data } = await cbor.decodeFirst(payload);
    console.log(action);
    console.log(data);
    if (!Object.values(KNOWN_ACTIONS).includes(action)) {
      throw new InvalidTransaction(`Unable to process action: ${action}`);
    }
    if (typeof data.vin !== 'string') {
      throw new InvalidTransaction(
        'All transactions must include a vehicle VIN',
      );
    }
    return new VehiclePayload(action, data);
  }

  /**
   * Type guard for checking if a `Partial<Vehicle>` is complete, thereby being a `Vehicle`.
   *
   * @param {Partial<Vehicle>} vehicle
   * @return {vehicle is Vehicle}
   */
  static isComplete(vehicle) {
    return (
      typeof vehicle.color === 'string' &&
      typeof vehicle.model === 'string' &&
      typeof vehicle.status === 'number' &&
      typeof vehicle.vin === 'string'
    );
  }
}

module.exports = VehiclePayload;
