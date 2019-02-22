'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const logger = require('../logger');
const { CLAIM_FAMILY, CLAIM_NAMESPACE } = require('./constants');
const ClaimPayload = require('./payload');
const ClaimState = require('./state');

class ClaimHandler extends TransactionHandler {
  constructor() {
    super(CLAIM_FAMILY, ['1.0'], [CLAIM_NAMESPACE]);
  }

  /**
   * Main sawtooth transaction handler.
   *
   * @param {Sawtooth.Protobuf.Transaction} transaction
   * @param {Sawtooth.Processor.Context} context
   */
  async apply(transaction, context) {
    logger.info('Transaction received');
    logger.debug('Transaction header', {
      data: { header: transaction.header },
    });
    const { Actions, ...payload } = await ClaimPayload.fromBytes(
      transaction.payload,
    );
    const state = new ClaimState(context);
    switch (payload.action) {
      case Actions.CREATE_CLAIM: {
        const { data: dataWithDefaults } = await ClaimPayload.fromBytes(
          transaction.payload,
          true,
        );
        logger.info('Processing action: CREATE_CLAIM');
        return this.createClaim(dataWithDefaults, state);
      }
      case Actions.EDIT_CLAIM: {
        logger.info('Processing action: EDIT_CLAIM');
        return this.editClaim(payload.data, state);
      }
      default:
        logger.error(`Unable to process action: ${payload.action}`);
        throw new InvalidTransaction(
          `Unable to process action: ${payload.action}`,
        );
    }
  }

  /**
   * CREATE_CLAIM action handler.
   *
   * @param {Protos.Claim} claim
   * @param {ClaimState} state
   */
  async createClaim(claim, state) {
    const { vin } = claim.vehicle;
    const existingClaim = await state.getClaim(vin);
    if (existingClaim) {
      logger.error(`Claim already exists for VIN: ${vin}`);
      throw new InvalidTransaction('Claim already exists');
    }
    logger.debug(`Creating new claim using VIN: ${vin}`);
    return state.setClaim(vin, claim);
  }

  /**
   * EDIT_CLAIM action handler.
   *
   * @param {Protos.Claim} claim
   * @param {ClaimState} state
   */
  async editClaim(claim, state) {
    const { vin } = claim.vehicle;
    const existingClaim = await state.getClaim(vin);
    if (!existingClaim) {
      logger.error(`Attempted to edit a non-existing claim for VIN: ${vin}.`);
      throw new InvalidTransaction('Claim does not exist');
    }
    logger.debug(`Editing existing claim using VIN: ${vin}`);
    return state.setClaim(vin, {
      ...existingClaim,
      ...claim,
      vehicle: {
        ...existingClaim.vehicle,
        ...claim.vehicle,
      },
      files: this._mergeFiles(existingClaim.files, claim.files),
    });
  }

  /**
   * Given an array of the existing files for a given block, merge new files
   * intelligently based on the hashes.
   *
   * @param {Protos.File[]} currFiles - Existing files on the block.
   * @param {Protos.File[]} newFiles  - New files to be merged into the block.
   * @return {Protos.File[]}
   */
  _mergeFiles(currFiles, newFiles) {
    return [...newFiles, ...currFiles].filter(
      (file, idx, self) => self.findIndex(f => f.hash === file.hash) === idx,
    );
  }
}

module.exports = ClaimHandler;
