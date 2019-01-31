'use strict';
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const protobuf = require('sawtooth-sdk/protobuf');
const { CryptoFactory } = require('sawtooth-sdk/signing');
const {
  Secp256k1PrivateKey: PrivateKey,
  Secp256k1Context: Context,
} = require('sawtooth-sdk/signing/secp256k1');

const API = require('./api');
const {
  createBatch,
  familyHashUtils,
  makeTransactionCreator,
} = require('./client-utils');

/**
 * @typedef {object} Vehicle - Vehicle payload interface.
 * @prop {string} vin - The VIN.
 * @prop {string} model - The model of the vehicle.
 * @prop {string} color - The color of the vehicle.
 * @prop {number} status - An integer representing the vehicles status.
 */

/**
 * Actions for the transaction processor.
 *
 * @enum {string}
 */
const Actions = {
  CREATE_VEHICLE: 'CREATE_VEHICLE',
  EDIT_VEHICLE: 'EDIT_VEHICLE',
};

const FAMILY_NAME = 'vehicle';
const FAMILY_VERSION = '1.0';
const { FAMILY_NAMESPACE, calculateAddress } = familyHashUtils(FAMILY_NAME);
const createTransaction = makeTransactionCreator(FAMILY_NAME, FAMILY_VERSION);

class VehicleClient {
  /**
   * Constructor.
   *
   * @param {string} [privateKey] - The user's private key (if needed).
   */
  constructor(privateKey) {
    if (!privateKey) {
      return;
    }
    /**
     * A signer instance if a private key was given.
     * @type {import('./client-utils').Signer}
     */
    this.signer = new CryptoFactory(new Context()).newSigner(
      PrivateKey.fromHex(privateKey),
    );
  }

  /**
   * Insert a new vehicle into the blockchain.
   *
   * @param {Vehicle} data - The vehicle data.
   */
  async createVehicle(data) {
    if (
      typeof data.vin !== 'string' ||
      typeof data.color !== 'string' ||
      typeof data.model !== 'string' ||
      typeof data.status !== 'number'
    ) {
      throw new InvalidTransaction('Data for transaction is incomplete.');
    }
    const address = calculateAddress(data.vin);
    return API.sendBatches(
      createBatch(
        this.signer,
        createTransaction(this.signer, Actions.CREATE_VEHICLE, data, {
          inputs: [address],
          outputs: [address],
        }),
      ),
    );
  }

  /**
   * Edit an exiting vehicle on the blockchain.
   *
   * @param {Partial<Vehicle> & { vin: string }} data - The vehicle data to edit.
   */
  async editVehicle(data) {
    if (typeof data.vin !== 'string') {
      throw new InvalidTransaction('VIN must be specified in the data');
    }
    const address = calculateAddress(data.vin);
    return API.sendBatches(
      createBatch(
        this.signer,
        createTransaction(this.signer, Actions.EDIT_VEHICLE, data, {
          inputs: [address],
          outputs: [address],
        }),
      ),
    );
  }

  /**
   * Retrieve a vehicle from the blockchain.
   *
   * @param {string} vin - The VIN of the vehicle to retrieve.
   */
  getVehicle(vin) {
    if (typeof vin !== 'string') {
      throw new InvalidTransaction('VIN must be specified in the data');
    }
    const address = calculateAddress(vin);
    return API.getStateItem(address);
  }

  /**
   * Retrives a list of items from the blockchain.
   *
   * @param {import('./api').GetStateParams} [params] - Extra query parameters for the `/state` endpoint.
   * @return {Promise<Response>}
   */
  listVehicles(params) {
    return API.getState({ ...params, address: FAMILY_NAMESPACE });
  }
}

module.exports = VehicleClient;
