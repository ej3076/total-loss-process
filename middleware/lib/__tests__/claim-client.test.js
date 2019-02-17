'use strict';

const {
  AuthorizationException,
  InvalidTransaction,
} = require('sawtooth-sdk/processor/exceptions');

const ClaimClient = require('../claim-client');
const createFamily = require('../utils/family');
const { loadType } = require('../utils/proto');

const { calculateAddress } = createFamily('claim');

/**
 * @type {any}
 */
const api = require('../api');
jest.mock('../api');

describe('ClaimClient', () => {
  const CLAIM = {
    files: [],
    status: 0,
    vehicle: {
      vin: '12345678910',
    },
  };

  /**
   * @type {ClaimClient}
   */
  let client;

  beforeAll(async () => {
    const ClaimType = await loadType('Claim');
    const buffer = /** @type {Buffer} */ (ClaimType.encode(CLAIM).finish());
    api.__STATE.clear();
    api.__STATE.set(
      calculateAddress(CLAIM.vehicle.vin),
      buffer.toString('base64'),
    );
  });

  describe('Authenticated', () => {
    beforeEach(() => {
      client = new ClaimClient(
        '4b30d06db5ab5abd07adb9e0915ae4bbf90ae7a1a630f11790a8e2b8598d6743',
      );
    });

    it('should create claims correctly', async () => {
      await expect(client.createClaim(CLAIM)).resolves.toMatchObject({
        link: expect.any(String),
      });
    });

    it('should edit claims correctly', async () => {
      await expect(
        client.editClaim(CLAIM.vehicle.vin, { vehicle: { color: 'red' } }),
      ).resolves.toMatchObject({
        link: expect.any(String),
      });
    });

    it('should throw InvalidTransaction when missing VIN', async () => {
      await expect(client.createClaim({ vehicle: {} })).rejects.toThrow(
        new InvalidTransaction(
          'VIN must be provided for all claim transactions',
        ),
      );
    });

    it('should throw InvalidTransaction with invalid claim data', async () => {
      /** @type {any} */
      const claim = { vehicle: { color: Symbol('Red') } };
      await expect(client.editClaim(CLAIM.vehicle.vin, claim)).rejects.toThrow(
        new InvalidTransaction('data.vehicle.color: string expected'),
      );
    });
  });

  describe('Not Authenticated', () => {
    beforeEach(() => {
      client = new ClaimClient();
    });

    it('should list claims correctly', async () => {
      const claims = await client.listClaims();
      expect(claims).toEqual([
        {
          ...CLAIM,
          vehicle: {
            ...CLAIM.vehicle,
            color: '',
            miles: 0,
            model: '',
            year: 0,
          },
        },
      ]);
    });

    it('should get claims correctly', async () => {
      const claim = await client.getClaim(CLAIM.vehicle.vin);
      expect(claim).toEqual({
        ...CLAIM,
        vehicle: {
          ...CLAIM.vehicle,
          color: '',
          miles: 0,
          model: '',
          year: 0,
        },
      });
      await expect(client.getClaim('asdf')).rejects.toThrowError();
    });

    it('should throw errors when trying to create claims unauthenticated', async () => {
      await expect(client.createClaim(CLAIM)).rejects.toThrow(
        new AuthorizationException(
          'Signer private key must be provided to use this method.',
        ),
      );
    });

    it('should throw errors when trying to edit claims unauthenticated', async () => {
      await expect(client.editClaim(CLAIM.vehicle.vin, CLAIM)).rejects.toThrow(
        new AuthorizationException(
          'Signer private key must be provided to use this method.',
        ),
      );
    });
  });
});
