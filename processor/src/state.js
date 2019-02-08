'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { addressFromVIN } = require('./constants');
const { loadType } = require('./proto');

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
        [address]: await this._serialize(data),
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
    const Data = await loadType('vehicle.proto', 'vehicle.Data');
    return /** @type {Vehicle} */ (Data.toObject(Data.decode(data)));
  }

  /**
   * Serializes and returns data for a single address.
   *
   * @param {Vehicle} vehicle
   * @returns {Promise<Buffer>}
   */
  async _serialize(vehicle) {
    const Data = await loadType('vehicle.proto', 'vehicle.Data');
    const err = Data.verify(vehicle);
    if (err) {
      throw new InvalidTransaction(err);
    }
    return /** @type {Buffer} */ (Data.encode(vehicle).finish());
  }
}

module.exports = VehicleState;
