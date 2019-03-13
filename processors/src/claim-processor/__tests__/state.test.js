'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const { addressFromVIN } = require('../constants');
const ClaimState = require('../state');

describe('ClaimState', () => {
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
  const ADDRESS = addressFromVIN('1234567890');
  /**
   * @type {{[k in keyof Sawtooth.Processor.Context]: jest.Mock}}
   */
  let context;
  /**
   * @type {import('../state')}
   */
  let state;

  beforeEach(() => {
    context = {
      addEvent: jest.fn(),
      addReceiptData: jest.fn(),
      deleteState: jest.fn(),
      getState: jest.fn(),
      setState: jest.fn(),
    };
    state = new ClaimState(context);
  });

  it('should serialize data correctly', async () => {
    const buffer = await state._serialize(DATA);
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it('should deserialize correctly', async () => {
    const buffer = await state._serialize(DATA);
    const claim = await state._deserialize(buffer);
    expect(claim).toEqual(DATA);
  });

  it('should serialize default values when given partial valid data', async () => {
    const { location, miles, ...vehicle } = DATA.vehicle;
    const buffer = await state._serialize({ ...DATA, vehicle: { ...vehicle } });
    const claim = await state._deserialize(buffer);
    expect(claim).toEqual({
      ...DATA,
      vehicle: {
        ...DATA.vehicle,
        miles: 0,
        location: '',
      },
    });
  });

  it('should throw InvalidTransaction when given data of incorrect type', async () => {
    /** @type {any} */
    let invalid = { ...DATA, vehicle: { ...DATA.vehicle, location: true } };
    await expect(state._serialize(invalid)).rejects.toThrow(InvalidTransaction);
    await expect(state._serialize(invalid)).rejects.toThrow(
      new InvalidTransaction('vehicle.location: string expected'),
    );

    invalid = { ...DATA, vehicle: 42 };
    await expect(state._serialize(invalid)).rejects.toThrow(InvalidTransaction);
    await expect(state._serialize(invalid)).rejects.toThrow(
      new InvalidTransaction('vehicle.object expected'),
    );

    invalid = { foo: 'bar' };
    await expect(state._serialize(invalid)).rejects.toThrow(InvalidTransaction);
    await expect(state._serialize(invalid)).rejects.toThrow(
      new InvalidTransaction('VehicleType: object expected'),
    );

    invalid = { status: Symbol('NOPE') };
    await expect(state._serialize(invalid)).rejects.toThrow(InvalidTransaction);
    await expect(state._serialize(invalid)).rejects.toThrow(
      new InvalidTransaction('status: enum value expected'),
    );
  });

  it('should throw InvalidTransaction when given an empty vehicle', async () => {
    const invalid = { ...DATA, vehicle: {} };
    await expect(state._serialize(invalid)).rejects.toThrow(InvalidTransaction);
    await expect(state._serialize(invalid)).rejects.toThrow(
      new InvalidTransaction('VIN must be provided for all transactions'),
    );
  });

  describe('getClaim()', () => {
    it('it should retrieve claims correctly', async () => {
      const buffer = await state._serialize(DATA);
      context.getState.mockReturnValue({ [ADDRESS]: buffer });
      const claim = await state.getClaim('1234567890');
      expect(context.getState).toBeCalledWith([ADDRESS], state.timeout);
      expect(claim).toEqual(DATA);
    });

    it('should retrieve claims from cache if they exist', async () => {
      state.cache.set(ADDRESS, DATA);
      const data = await state.getClaim('1234567890');
      expect(context.getState).not.toBeCalled();
      expect(data).toEqual(DATA);
    });

    it('should return undefined if address doesnt exist in state', async () => {
      context.getState.mockReturnValue({ [ADDRESS]: [] });
      const claim = await state.getClaim('1234567890');
      expect(context.getState).toBeCalledWith([ADDRESS], state.timeout);
      expect(claim).toBeUndefined();
    });
  });

  describe('setClaim()', () => {
    it('should set claims correctly', async () => {
      const buffer = await state._serialize(DATA);
      await state.setClaim('1234567890', DATA);
      expect(state.cache.get(ADDRESS)).toEqual(DATA);
      expect(context.setState).toBeCalledWith(
        { [ADDRESS]: buffer },
        state.timeout,
      );
    });
  });

  describe('deleteClaim()', () => {
    it('should call deleteState correctly', async () => {
      await state.deleteClaim('1234567890');
      expect(context.deleteState).toBeCalledWith([ADDRESS], state.timeout);
    });
  });
});
