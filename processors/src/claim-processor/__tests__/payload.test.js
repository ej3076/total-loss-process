'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { loadType } = require('../../../../utils/proto');
const ClaimPayload = require('../payload');

describe('ClaimPayload', () => {
  /**
   * @type {Readonly<Protos.Claim>}
   */
  const DATA = Object.freeze({
    status: 0,
    created: new Date(Date.UTC(2019, 0)).toJSON(),
    modified: new Date(Date.UTC(2019, 0)).toJSON(),
    date_of_loss: new Date(Date.UTC(2019, 0)).toJSON(),
    vehicle: {
      vin: '1234567890',
      miles: 1000,
      location: 'salvage',
    },
    insurer: {
      name: '',
      deductible: 0,
      has_gap: false,
    },
    files: [],
  });

  /**
   * @type {PromiseReturnType<import('../../../../utils/proto').loadType>}
   */
  let PayloadType;

  /**
   * @type {{[k: string]: number}}
   */
  let Actions;

  beforeAll(async () => {
    PayloadType = await loadType('ClaimPayload');
    Actions = PayloadType.getEnum('Action');
  });

  it('should decode a valid payload buffer', async () => {
    const payload = await ClaimPayload.fromBytes(
      PayloadType.encode({
        action: Actions.CREATE_CLAIM,
        data: DATA,
      }).finish(),
    );
    expect(payload.data).toEqual(DATA);
    expect(payload.action).toEqual(Actions.CREATE_CLAIM);
  });

  it('should resolve to default values when given partial payload and default = true', async () => {
    const { location, miles, ...data } = DATA.vehicle;
    const payload = await ClaimPayload.fromBytes(
      PayloadType.encode({
        action: Actions.CREATE_CLAIM,
        data: {
          ...DATA,
          vehicle: {
            ...data,
          },
        },
      }).finish(),
      true,
    );
    expect(payload.data).toEqual({
      ...DATA,
      vehicle: {
        vin: '1234567890',
        miles: 0,
        location: '',
      },
    });
  });

  it('should not resolve to default values when given partial payload and default = false or undefined', async () => {
    const { location, miles, ...data } = DATA.vehicle;
    const payload = await ClaimPayload.fromBytes(
      PayloadType.encode({
        action: Actions.CREATE_CLAIM,
        data: {
          ...DATA,
          vehicle: {
            ...data,
          },
        },
      }).finish(),
    );
    expect(payload.data).toEqual({
      ...DATA,
      vehicle: {
        vin: '1234567890',
      },
    });
  });

  it('should throw InvalidTransaction when given an invalid payload', async () => {
    let payload = PayloadType.encode({ foo: 234 }).finish();
    await expect(ClaimPayload.fromBytes(payload)).rejects.toThrow(
      InvalidTransaction,
    );
    await expect(ClaimPayload.fromBytes(payload)).rejects.toThrow(
      new InvalidTransaction('Error decoding payload data: object expected'),
    );
  });
});
