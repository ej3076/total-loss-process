'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { addressFromVIN } = require('./constants');
const { loadType } = require('./proto');

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
   * Retrieves and deserlializes a claim's data.
   *
   * @param {string} vin - The VIN number of the claim.
   * @returns {Promise<Protos.Claim | undefined>}
   */
  async getClaim(vin) {
    const address = addressFromVIN(vin);
    if (this.cache.has(address)) {
      return this.cache.get(address);
    }
    const state = await this.context.getState([address], this.timeout);
    // TODO: Look into this to see exactly what is returned for non-existant values
    if (!state[address].toString()) {
      return;
    }
    return this._deserialize(state[address]);
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
    return /** @type {Protos.Claim} */ (ClaimType.decode(data).toJSON());
  }

  /**
   * Serializes and returns data for a single address.
   *
   * @param {Protos.Claim} data - Data to be serialized.
   * @returns {Promise<Buffer>}
   */
  async _serialize(data) {
    const ClaimType = await loadType('Claim');
    const err = ClaimType.verify(data);
    if (err) {
      throw new InvalidTransaction(err);
    }
    return /** @type {Buffer} */ (ClaimType.encode(data).finish());
  }
}

module.exports = ClaimState;
