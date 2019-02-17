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
const s3 = require('./utils/s3');
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
   * Add 1 or more files to an existing claim.
   *
   * @param {string} vin                  - The VIN of the claim.
   * @param {Express.Multer.File[]} files - Array of uploaded files.
   */
  async addFiles(vin, files) {
    const claim = await this.getClaim(vin);
    await s3.maybeCreateBucket(vin);
    return this._batch('EDIT_CLAIM', {
      ...claim,
      files: [
        ...claim.files,
        ...(await Promise.all(files.map(file => s3.uploadFile(vin, file)))),
      ],
    });
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
   * @param {string} vin                      - The VIN of the claim to edit.
   * @param {DeepPartial<Protos.Claim>} claim - The claim data to edit.
   */
  async editClaim(vin, { files, vehicle = {}, ...rest }) {
    if (vehicle.vin && vehicle.vin !== vin) {
      throw new InvalidTransaction(
        'VIN in edit data must match VIN requested.',
      );
    }
    if (files) {
      throw new InvalidTransaction(
        'Files can not be modified using this endpoint.',
      );
    }
    const claim = await this.getClaim(vin);
    return this._batch('EDIT_CLAIM', {
      ...rest,
      vehicle: {
        ...claim.vehicle,
        ...vehicle,
      },
    });
  }

  /**
   * Rename a single file in a claim.
   *
   * @param {string} vin  - The VIN associated with the file.
   * @param {string} from - The current name of the file.
   * @param {string} to   - The new name of the file.
   */
  async renameFile(vin, from, to) {
    const claim = await this.getClaim(vin);
    await s3.renameFile(vin, from, to);
    return this._batch('EDIT_CLAIM', {
      ...claim,
      files: claim.files.map(file => {
        if (file.name === from) {
          return { ...file, name: to };
        }
        return file;
      }),
    });
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
   * Retrieve a single file for a given claim.
   *
   * @param {string} vin - The VIN of the claim.
   * @param {Protos.File} fileProto - The file proto object.
   */
  async getFile(vin, fileProto) {
    return s3.getFile(vin, fileProto.name, fileProto.hash);
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
   * Delete a single file from a claim.
   *
   * @param {string} vin  - The VIN of the associated claim.
   * @param {string} name - The name of the file to remove.
   */
  async deleteFile(vin, name) {
    const claim = await this.getClaim(vin);
    await s3.deleteFile(vin, name);
    return this._batch('EDIT_CLAIM', {
      ...claim,
      files: claim.files.filter(file => file.name !== name),
    });
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
