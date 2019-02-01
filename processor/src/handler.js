'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const {
  KNOWN_ACTIONS,
  VEHICLE_FAMILY,
  VEHICLE_NAMESPACE,
} = require('./constants');
const VehiclePayload = require('./payload');
const VehicleState = require('./state');

/**
 * @typedef {object} TransactionHeader
 * @prop {string} batcherPublicKey - Public key for the client who added this transaction to a batch.
 * @prop {string[]} dependencies   - A list of transaction signatures that describe the transactions that must be processed before this transaction can be valid.
 * @prop {string} familyName       - The family name correlates to the transaction processor's family name that this transaction can be processed on, for example `intkey`.
 * @prop {string} familyVersion    - The family version correlates to the transaction processor's family version that this transaction can be processed on, for example `1.0`.
 * @prop {string[]} inputs         - A list of addresses that are given to the context manager and control what addresses the transaction processor is allowed to read from.
 * @prop {string} nonce            - A random string that provides uniqueness for transactions with otherwise identical fields.
 * @prop {string[]} outputs        - A list of addresses that are given to the context manager and control what addresses the transaction processor is allowed to write to.
 * @prop {string} payloadSha512    - The sha512 hash of the encoded payload.
 * @prop {string} signerPublicKey  - Public key for the client that signed the TransactionHeader.
 */

/**
 * @typedef {object} Transaction
 * @prop {TransactionHeader} header
 * @prop {string} headerSignature - The signature derived from signing the header.
 * @prop {Buffer} payload         - The encoded family specific information of the transaction.
 */

class VehicleHandler extends TransactionHandler {
  constructor() {
    super(VEHICLE_FAMILY, ['1.0'], [VEHICLE_NAMESPACE]);
  }

  /**
   * Main sawtooth transaction handler.
   *
   * @param {Transaction} transaction
   * @param {import('sawtooth-sdk/processor/context')} context
   */
  async apply(transaction, context) {
    const payload = await VehiclePayload.fromBytes(transaction.payload);
    const state = new VehicleState(context);
    switch (payload.action) {
      case KNOWN_ACTIONS.CREATE_VEHICLE:
        return this.createVehicle(payload, state);
      case KNOWN_ACTIONS.EDIT_VEHICLE:
        return this.editVehicle(payload, state);
      default:
        throw new InvalidTransaction(
          `Unable to process action: ${payload.action}`,
        );
    }
  }

  /**
   * CREATE_VEHICLE action handler.
   *
   * @param {VehiclePayload} payload
   * @param {VehicleState} state
   */
  async createVehicle(payload, state) {
    if (!VehiclePayload.isComplete(payload.data)) {
      throw new InvalidTransaction(
        'Payload must be complete in order to create a new vehicle',
      );
    }
    const { vin, ...data } = payload.data;
    const existingVehicle = await state.getVehicle(vin);
    if (existingVehicle) {
      throw new InvalidTransaction('Vehicle already exists');
    }
    return state.setVehicle(vin, { vin, ...data });
  }

  /**
   * EDIT_VEHICLE action handler.
   *
   * @param {VehiclePayload} payload
   * @param {VehicleState} state
   */
  async editVehicle(payload, state) {
    const { vin, ...data } = payload.data;
    const vehicle = await state.getVehicle(vin);
    if (!vehicle) {
      throw new InvalidTransaction('Vehicle does not exist');
    }
    return state.setVehicle(vin, { ...vehicle, ...data });
  }
}

module.exports = VehicleHandler;
