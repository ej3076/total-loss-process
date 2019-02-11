'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

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
    const { Actions, ...payload } = await ClaimPayload.fromBytes(
      transaction.payload,
    );
    const state = new ClaimState(context);
    switch (payload.action) {
      case Actions.CREATE_CLAIM:
        return this.createClaim(payload.data, state);
      case Actions.EDIT_CLAIM:
        return this.editClaim(payload.data, state);
      default:
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
      throw new InvalidTransaction('Claim already exists');
    }
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
      throw new InvalidTransaction('Claim does not exist');
    }
    return state.setClaim(vin, {
      ...existingClaim,
      ...claim,
      files: [...existingClaim.files, ...claim.files],
      vehicle: {
        ...existingClaim.vehicle,
        ...claim.vehicle,
        vin,
      },
    });
  }
}

module.exports = ClaimHandler;
