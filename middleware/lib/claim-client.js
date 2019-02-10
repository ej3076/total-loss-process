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
 * `DeepPartial<Protos.Claim>` with required vin.
 * @typedef {DeepPartial<Protos.Claim> & { vehicle: { vin: string } }} ClaimParam
 */

const { FAMILY_NAME, FAMILY_NAMESPACE, calculateAddress } = createFamily(
  'claim',
);
const createTransaction = utils.makeTransactionCreator(FAMILY_NAME, '1.0');

class ClaimClient {
  /**
   * Constructor.
   *
   * @param {string} [privateKey] - The user's private key (if needed).
   */
  constructor(privateKey) {
    if (privateKey) {
      /**
       * A signer instance if a private key was given.
       * @type {Sawtooth.Signing.Signer}
       */
      this.signer = new CryptoFactory(new Context()).newSigner(
        PrivateKey.fromHex(privateKey),
      );
    }
  }

  /**
   * Insert a new claim into the blockchain.
   *
   * @param {ClaimParam} claim - The claim data.
   */
  async createClaim(claim) {
    const PayloadType = await loadType('ClaimPayload');
    const Actions = PayloadType.getEnum('Action');
    const payload = {
      action: Actions.CREATE_VEHICLE,
      data: claim,
    };
    const err = PayloadType.verify(payload);
    if (err || !claim.vehicle || !claim.vehicle.vin) {
      throw new InvalidTransaction(
        err || 'VIN must be provided for all claim transactions',
      );
    }
    const address = calculateAddress(claim.vehicle.vin);
    return API.sendBatches(
      createBatch(
        this.signer,
        createTransaction(this.signer, PayloadType.encode(payload).finish(), {
          inputs: [address],
          outputs: [address],
        }),
      ),
    );
  }

  /**
   * Edit an exiting claim on the blockchain.
   *
   * @param {ClaimParam} claim - The claim data to edit.
   */
  async editClaim(claim) {
    const PayloadType = await loadType('ClaimPayload');
    const Actions = PayloadType.getEnum('Action');
    const payload = {
      action: Actions.EDIT_VEHICLE,
      data: claim,
    };
    const err = PayloadType.verify(payload);
    if (err || !claim.vehicle || !claim.vehicle.vin) {
      throw new InvalidTransaction(
        err || 'VIN must be provided for all claim transactions',
      );
    }
    const address = calculateAddress(claim.vehicle.vin);
    return API.sendBatches(
      createBatch(
        this.signer,
        createTransaction(this.signer, PayloadType.encode(payload).finish(), {
          inputs: [address],
          outputs: [address],
        }),
      ),
    );
  }

  /**
   * Retrieve a claim from the blockchain.
   *
   * @param {string} vin - The VIN of the vehicle associated with the claim.
   * @return {Promise<Protos.Claim>}
   */
  async getClaim(vin) {
    const response = await API.getStateItem(calculateAddress(vin));
    const ClaimType = await loadType('Claim');
    return /** @type {Protos.Claim} */ (ClaimType.decode(
      Buffer.from(response.data, 'base64'),
    ).toJSON());
  }

  /**
   * Retrive a list of claims from the blockchain.
   *
   * @param {Sawtooth.API.GetStateParams} [params] - Extra query parameters for the `/state` endpoint.
   * @return {Promise<Protos.Claim[]>}
   */
  async listClaims(params) {
    const { data } = await API.getState({
      ...params,
      address: FAMILY_NAMESPACE,
    });
    const ClaimType = await loadType('Claim');
    return data.map(state =>
      /** @type {Protos.Claim} */ (ClaimType.decode(
        Buffer.from(state.data, 'base64'),
      ).toJSON()),
    );
  }
}

module.exports = ClaimClient;
