'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const logger = require('../logger');
const { loadType } = require('../proto');
const { addressFromVIN } = require('./constants');

class ClaimState {
  /**
   * Constructor.
   *
   * @param {Sawtooth.Processor.Context} context - The processor context.
   */
  constructor(context) {
    this.context = context;
    this.cache = new Map();
    this.timeout = 500;
  }

  /**
   * Deletes an existing claim.
   *
   * @param {string} vin - The VIN number of the claim.
   */
  async deleteClaim(vin) {
    const address = addressFromVIN(vin);
    this.cache.delete(address);
    return this.context.deleteState([address], this.timeout);
  }

  /**
   * Retrieves and deserlializes a claim's data.
   *
   * @param {string} vin - The VIN number of the claim.
   * @returns {Promise<Protos.Claim | undefined>}
   */
  async getClaim(vin) {
    const address = addressFromVIN(vin);
    if (this.cache.has(address)) {
      logger.debug(`Address ${address} exists in cache. Fetching cached state`);
      return this.cache.get(address);
    }
    const state = await this.context.getState([address], this.timeout);
    const serialized = state[address];
    if (Array.isArray(serialized)) {
      logger.debug(`Address ${address} does not yet exist on the blockchain`);
      return;
    }
    return this._deserialize(serialized);
  }

  /**
   * Serializes and sets a claim's data.
   *
   * @param {string} vin - The VIN number of the vehicle.
   * @param {Protos.Claim} data - The claim data.
   * @returns {Promise<string[]>} The address(es) successfully set.
   */
  async setClaim(vin, data) {
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
   * Deserializes and returns data for a single address.
   *
   * @param {Buffer} data - Data to be deserialized.
   * @returns {Promise<Protos.Claim>}
   */
  async _deserialize(data) {
    const ClaimType = await loadType('Claim');
    return /** @type {Protos.Claim} */ (ClaimType.toObject(
      ClaimType.decode(data),
      {
        defaults: true,
      },
    ));
  }

  /**
   * Serializes and returns data for a single address.
   *
   * @param {DeepPartial<Protos.Claim>} data - Data to be serialized.
   * @returns {Promise<Buffer>}
   */
  async _serialize(data) {
    const ClaimType = await loadType('Claim');
    const VehicleType = ClaimType.lookupType('Vehicle');
    const { vehicle } = /** @type {Protos.Claim} */ (data);
    let err = ClaimType.verify(data);
    if (err) {
      throw new InvalidTransaction(err);
    }
    err = VehicleType.verify(vehicle);
    if (err) {
      throw new InvalidTransaction(`VehicleType: ${err}`);
    }
    if (!vehicle.vin) {
      throw new InvalidTransaction('VIN must be provided for all transactions');
    }
    return /** @type {Buffer} */ (ClaimType.encode(data).finish());
  }
}

module.exports = ClaimState;
