'use strict';

const cbor = require('cbor');

const { addressFromVIN } = require('./constants');

/**
 * @typedef {import('sawtooth-sdk/processor/context')} Context Sawtooth context.
 */

/**
 * @typedef {object} Vehicle - Vehicle payload interface.
 * @prop {string} vin - The VIN.
 * @prop {string} model - The model of the vehicle.
 * @prop {string} color - The color of the vehicle.
 * @prop {number} status - An integer representing the vehicles status.
 */

class VehicleState {
  /**
   * Constructor.
   *
   * @param {Context} context The processor context.
   */
  constructor(context) {
    this.context = context;
    this.cache = new Map();
    this.timeout = 500;
  }

  /**
   * Retrieves and deserlializes a vehicle's data.
   *
   * @param {string} vin The VIN number of the vehicle.
   * @returns {Promise<Vehicle | undefined>}
   */
  async getVehicle(vin) {
    return this._loadVehicle(vin);
  }

  /**
   * Serializes and sets a vehicle's data.
   *
   * @param {string} vin The VIN number of the vehicle.
   * @param {Vehicle} data
   * @returns {Promise<string[]>} The address(es) successfully set.
   */
  async setVehicle(vin, data) {
    const address = addressFromVIN(vin);
    this.cache.set(address, data);
    return this.context.setState(
      {
        [address]: this._serialize(data),
      },
      this.timeout,
    );
  }

  /**
   * Loads, deserializes, and returns a given vehicle's data.
   *
   * @param {string} vin The VIN number of the vehicle.
   * @returns {Promise<Vehicle | undefined>}
   */
  async _loadVehicle(vin) {
    const address = addressFromVIN(vin);
    if (this.cache.has(address)) {
      return this.cache.get(address);
    }
    const state = await this.context.getState([address], this.timeout);
    if (!state[address].toString()) {
      return;
    }
    return this._deserialize(state[address]);
  }

  /**
   * Deserializes and returns data for a single address.
   *
   * @param {Buffer} data Vehicle data to be deserialized.
   * @returns {Promise<Vehicle>}
   */
  async _deserialize(data) {
    return cbor.decodeFirstSync(data);
  }

  /**
   * Serializes and returns data for a single address.
   *
   * @param {Vehicle} vehicle
   * @returns {Buffer}
   */
  _serialize(vehicle) {
    return cbor.encode(vehicle);
  }
}

module.exports = VehicleState;
