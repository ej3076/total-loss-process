'use strict';

const {
  AuthorizationException,
  InvalidTransaction,
} = require('sawtooth-sdk/processor/exceptions');

const { CryptoFactory } = require('sawtooth-sdk/signing');
const {
  Secp256k1PrivateKey: PrivateKey,
  Secp256k1Context: Context,
} = require('sawtooth-sdk/signing/secp256k1');

const { createBatch, ...utils } = require('./utils/client');
const createFamily = require('./utils/family');
const { loadType } = require('./utils/proto');
const API = require('./api');

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
      this._signer = new CryptoFactory(new Context()).newSigner(
        PrivateKey.fromHex(privateKey),
      );
    }
  }

  get signer() {
    if (!this._signer) {
      throw new AuthorizationException(
        'Signer private key must be provided to use this method.',
      );
    }
    return this._signer;
  }

  /**
   * Insert a new claim into the blockchain.
   *
   * @param {DeepPartial<Protos.Claim>} claim - The claim data.
   */
  async createClaim(claim) {
    return this._batch('CREATE_CLAIM', claim);
  }

  /**
   * Edit an existing claim on the blockchain using VIN.
   *
   * @param {DeepPartial<Protos.Claim>} claim - The claim data to edit.
   */
  async editClaim(claim) {
    return this._batch('EDIT_CLAIM', claim);
  }

  /**
   * Retrieve a claim from the blockchain using VIN.
   *
   * @param {string} vin - The VIN of the vehicle associated with the claim.
   * @return {Promise<Protos.Claim>}
   */
  async getClaim(vin) {
    const { data } = await API.getStateItem(calculateAddress(vin));
    return this._decode(data);
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
    return Promise.all(data.map(state => this._decode(state.data)));
  }

  /**
   * Abstraction for sending batch transactions.
   *
   * @private
   * @param {keyof typeof Protos.Payload.Actions.ClaimActions} actionKey - Action to perform.
   * @param {DeepPartial<Protos.Claim>} data                             - Claim data to send.
   */
  async _batch(actionKey, data) {
    const PayloadType = await loadType('ClaimPayload');
    const Actions = PayloadType.getEnum('Action');
    const action = Actions[actionKey];
    const payload = {
      action,
      data,
    };
    if (!data.vehicle || !data.vehicle.vin) {
      throw new InvalidTransaction(
        'VIN must be provided for all claim transactions',
      );
    }
    const invalidReason = PayloadType.verify(payload);
    if (invalidReason) {
      throw new InvalidTransaction(invalidReason);
    }
    const address = calculateAddress(data.vehicle.vin);
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
   * Decodes a claim object from a base64 encoded protobuf string.
   *
   * @private
   * @param {string} data - The encoded data.
   * @return {Promise<Protos.Claim>}
   */
  async _decode(data) {
    const ClaimType = await loadType('Claim');
    return /** @type {Protos.Claim} */ (ClaimType.toObject(
      ClaimType.decode(Buffer.from(data, 'base64')),
      {
        defaults: true,
      },
    ));
  }
}

module.exports = ClaimClient;
