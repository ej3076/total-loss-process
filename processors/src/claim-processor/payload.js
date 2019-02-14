'use strict';

const logger = require('../logger');
const { loadType } = require('../proto');

/**
 * @typedef {typeof Protos.Payload.Actions.ClaimActions} Actions
 * @typedef {Protos.Payload.ClaimPayload} Payload
 */

class ClaimPayload {
  /**
   * Constructor.
   *
   * @param {Payload} payload - The payload.
   * @param {Actions} actions - Known actions.
   */
  constructor(payload, actions) {
    this.action = payload.action;
    this.data = payload.data;
    this.Actions = actions;
  }

  /**
   * ClaimPayload builder.
   *
   * @param {Buffer} buffer - Raw payload buffer.
   * @return {Promise<ClaimPayload>}
   */
  static async fromBytes(buffer) {
    const PayloadType = await loadType('ClaimPayload');
    const payload = /** @type {Payload} */ (PayloadType.toObject(
      PayloadType.decode(buffer),
      {
        defaults: true,
      },
    ));
    logger.debug('Payload decoded', { data: { payload } });
    return new ClaimPayload(payload, PayloadType.Action);
  }
}

module.exports = ClaimPayload;
