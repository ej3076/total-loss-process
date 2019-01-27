'use strict';

const { addressFromVIN } = require('./constants');

/**
 * @typedef {import('sawtooth-sdk/processor/context')} Context Sawtooth context.
 */

/**
 * @typedef {Object.<string, unknown>} Data The data stored on the blockchain.
 */

module.exports = class VehicleState {
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
   * @returns {Promise<Data[]>}
   */
  async getVehicle(vin) {
    return this._loadVehicle(vin);
  }

  /**
   * Serializes and sets a vehicle's data.
   *
   * @param {string} vin The VIN number of the vehicle.
   * @param {Data[]} data
   * @returns {Promise<string[]>} The address(es) successfully set.
   */
  async setVehicle(vin, data) {
    const address = addressFromVIN(vin);
    const vehicle = await this._loadVehicle(vin);
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
   * @returns {Promise<Data[]>}
   */
  async _loadVehicle(vin) {
    const address = addressFromVIN(vin);
    const state = await this.context.getState([address], this.timeout);
    if (!state[address].toString()) {
      return [];
    }
    return this._deserialize(state[address]);
  }

  /**
   * Deserializes and returns data for a single address.
   *
   * @param {Buffer} data Data to be deserialized.
   * @returns {Data[]}
   */
  _deserialize(data) {
    return JSON.parse(data.toString());
  }

  /**
   * Serializes and returns data for a single address.
   *
   * @param {Data[]} data
   * @returns {Buffer}
   */
  _serialize(data) {
    return Buffer.from(JSON.stringify(data));
  }
};
