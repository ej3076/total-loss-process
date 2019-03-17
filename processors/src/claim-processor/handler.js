'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const logger = require('../../../utils/logger');
const { loadType } = require('../../../utils/proto');

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
    const Actions = (await loadType('ClaimPayload')).Action;
    const payload = await ClaimPayload.fromBytes(transaction.payload);
    const state = new ClaimState(context);
    switch (payload.action) {
      case Actions.CREATE_CLAIM: {
        logger.info('Processing action: CREATE_CLAIM');
        return this.createClaim(
          await ClaimPayload.fromBytes(transaction.payload, true),
          state,
        );
      }
      case Actions.DELETE_CLAIM: {
        logger.info('Processing action: DELETE_CLAIM');
        return this.deleteClaim(payload, state);
      }
      case Actions.EDIT_CLAIM: {
        logger.info('Processing action: EDIT_CLAIM');
        return this.editClaim(payload, state);
      }
      default:
        throw new InvalidTransaction(
          `Unable to process action: ${payload.action}`,
        );
    }
  }

  /**
   * CREATE_CLAIM action handler.
   *
   * @param {Protos.ClaimPayload} payload
   * @param {ClaimState} state
   */
  async createClaim({ data: claim, timestamp }, state) {
    const { vin } = claim.vehicle;
    const existingClaim = await state.getClaim(vin);
    if (existingClaim) {
      logger.error(`Claim already exists for VIN: ${vin}`);
      throw new InvalidTransaction('Claim already exists');
    }
    logger.debug(`Creating new claim using VIN: ${vin}`);
    return state.setClaim(vin, {
      ...claim,
      created: timestamp,
      modified: timestamp,
    });
  }

  /**
   * DELETE_CLAIM action handler.
   *
   * @param {Protos.ClaimPayload} payload
   * @param {ClaimState} state
   */
  async deleteClaim({ data: claim }, state) {
    const { vin } = claim.vehicle;
    return state.deleteClaim(vin);
  }

  /**
   * EDIT_CLAIM action handler.
   *
   * @param {Protos.ClaimPayload} payload
   * @param {ClaimState} state
   */
  async editClaim({ data: claim, timestamp }, state) {
    const { vin } = claim.vehicle;
    const existingClaim = await state.getClaim(vin);
    if (!existingClaim) {
      logger.error(`Attempted to edit a non-existing claim for VIN: ${vin}.`);
      throw new InvalidTransaction('Claim does not exist');
    }
    logger.debug(`Editing existing claim using VIN: ${vin}`);
    const insurer = {
      ...existingClaim.insurer,
      ...claim.insurer,
    };
    return state.setClaim(vin, {
      ...existingClaim,
      ...claim,
      created: existingClaim.created,
      modified: timestamp,
      vehicle: {
        ...existingClaim.vehicle,
        ...claim.vehicle,
      },
      ...(Object.keys(insurer).length > 0 ? { insurer } : {}),
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
