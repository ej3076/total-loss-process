'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const { CryptoFactory } = require('sawtooth-sdk/signing');
const {
  Secp256k1PrivateKey: PrivateKey,
  Secp256k1Context: Context,
} = require('sawtooth-sdk/signing/secp256k1');

const { createBatch, ...utils } = require('./utils/client');
const { createFamily } = require('./utils/processor');
const { loadType } = require('./utils/proto');
const API = require('./api');

/**
 * @typedef {object} Vehicle - Vehicle payload interface.
 * @prop {string} vin    - The VIN.
 * @prop {string} model  - The model of the vehicle.
 * @prop {string} color  - The color of the vehicle.
 * @prop {number} status - An integer representing the vehicles status.
 */

const { FAMILY_NAME, FAMILY_NAMESPACE, calculateAddress } = createFamily(
  'vehicle',
);
const createTransaction = utils.makeTransactionCreator(FAMILY_NAME, '1.0');

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
     * @type {import('sawtooth-sdk/signing').Signer}
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
    const Payload = await loadType('vehicle.proto', 'vehicle.Payload');
    const Data = await loadType('vehicle.proto', 'vehicle.Data');
    const payload = {
      action: Payload.Action.CREATE_VEHICLE,
      data,
    };
    const err = Data.verify(data) || Payload.verify(payload);
    if (err) {
      throw new InvalidTransaction(err);
    }
    const address = calculateAddress(data.vin);
    return API.sendBatches(
      createBatch(
        this.signer,
        createTransaction(this.signer, Payload.encode(payload).finish(), {
          inputs: [address],
          outputs: [address],
        }),
      ),
    );
  }

  /**
   * Edit an exiting vehicle on the blockchain.
   *
   * @param {Partial<Vehicle>} data - The vehicle data to edit.
   */
  async editVehicle(data) {
    const Payload = await loadType('vehicle.proto', 'vehicle.Payload');
    const Data = await loadType('vehicle.proto', 'vehicle.Data');
    const payload = {
      action: Payload.Action.EDIT_VEHICLE,
      data,
    };
    const err = Data.verify(data) || Payload.verify(payload);
    if (err || !data.vin) {
      throw new InvalidTransaction(err || 'VIN must be provided');
    }
    const address = calculateAddress(data.vin);
    return API.sendBatches(
      createBatch(
        this.signer,
        createTransaction(this.signer, Payload.encode(payload).finish(), {
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
   * @return {Promise<Vehicle>}
   */
  async getVehicle(vin) {
    if (typeof vin !== 'string') {
      throw new InvalidTransaction('VIN must be specified in the data');
    }
    const response = await API.getStateItem(calculateAddress(vin));
    const Data = await loadType('vehicle.proto', 'vehicle.Data');
    return /** @type {Vehicle} */ (Data.toObject(
      Data.decode(Buffer.from(response.data, 'base64')),
    ));
  }

  /**
   * Retrives a list of items from the blockchain.
   *
   * @param {import('./api').GetStateParams} [params] - Extra query parameters for the `/state` endpoint.
   * @return {Promise<Vehicle[]>}
   */
  async listVehicles(params) {
    const response = await API.getState({
      ...params,
      address: FAMILY_NAMESPACE,
    });
    const Data = await loadType('vehicle.proto', 'vehicle.Data');
    return Promise.all(
      response.data.map(({ data }) =>
        /** @type {Vehicle} */ (Data.toObject(
          Data.decode(Buffer.from(data, 'base64')),
        )),
      ),
    );
  }
}

module.exports = VehicleClient;
