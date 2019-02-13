'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { loadType } = require('../../proto');
const ClaimPayload = require('../payload');

describe('ClaimPayload', () => {
  /**
   * @type {Readonly<Protos.Claim>}
   */
  const DATA = Object.freeze({
    files: [],
    status: 0,
    vehicle: {
      vin: '1234567890',
      color: 'red',
      miles: 1000,
      model: 'sedan',
      year: 2019,
    },
  });

  /**
   * @type {PromiseReturnType<import('../../proto').loadType>}
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

  it('should resolve to default values when given partial payload', async () => {
    const { color, year, model, ...data } = DATA.vehicle;
    const payload = await ClaimPayload.fromBytes(
      PayloadType.encode({
        action: Actions.CREATE_CLAIM,
        data: {
          vehicle: {
            ...data,
          },
        },
      }).finish(),
    );
    expect(payload.data).toEqual({
      files: [],
      status: 0,
      vehicle: {
        vin: '1234567890',
        color: '',
        miles: 1000,
        model: '',
        year: 0,
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
