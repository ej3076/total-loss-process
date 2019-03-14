'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const logger = require('../../../utils/logger');
const { loadType } = require('../../../utils/proto');

/**
 * @typedef {typeof Protos.ClaimPayload.Action} Actions
 */

class ClaimPayload {
  /**
   * Constructor.
   *
   * @param {Protos.ClaimPayload} payload - The payload.
   */
  constructor({ action, data, timestamp }) {
    this.action = action;
    this.data = data;
    this.timestamp = timestamp;
  }

  /**
   * ClaimPayload builder.
   *
   * @param {Buffer|Uint8Array} buffer - Raw payload buffer.
   * @param {boolean} defaults         - Should payload proto be populated with default values?
   * @return {Promise<ClaimPayload>}
   */
  static async fromBytes(buffer, defaults = false) {
    const PayloadType = await loadType('ClaimPayload');
    const ClaimType = PayloadType.lookupType('Claim');
    const payload = /** @type {Protos.ClaimPayload} */ (PayloadType.toObject(
      PayloadType.decode(buffer),
      {
        arrays: true,
        defaults,
      },
    ));
    const err = ClaimType.verify(payload.data);
    if (err) {
      throw new InvalidTransaction(`Error decoding payload data: ${err}`);
    }
    logger.debug('Payload decoded', { data: { payload } });
    return new ClaimPayload(payload);
  }
}

module.exports = ClaimPayload;
