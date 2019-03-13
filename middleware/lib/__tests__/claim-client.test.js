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
  /**
   * @type {DeepPartial<Protos.Claim> & { vehicle: { vin: string } }}
   */
  const CLAIM = {
    status: 0,
    created: new Date(Date.UTC(2019, 1)).toJSON(),
    modified: new Date(Date.UTC(2019, 0)).toJSON(),
    date_of_loss: new Date(Date.UTC(2019, 0)).toJSON(),
    vehicle: {
      vin: '12345678910',
      miles: 0,
      location: '',
    },
    insurer: {
      name: '',
      deductible: 0,
      has_gap: false,
    },
    files: [],
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
      await expect(client.createClaim(CLAIM)).resolves;
    });

    it('should edit claims correctly', async () => {
      await expect(
        client.editClaim(CLAIM.vehicle.vin, {
          vehicle: { location: 'salvage' },
        }),
      ).resolves;
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
      const claim = { vehicle: { location: Symbol('Red') } };
      await expect(client.editClaim(CLAIM.vehicle.vin, claim)).rejects.toThrow(
        new InvalidTransaction('data.vehicle.location: string expected'),
      );
    });

    it('should throw InvalidTransaction when provided VINs mismatch', async () => {
      await expect(
        client.editClaim('12345', { vehicle: { vin: '55555' } }),
      ).rejects.toThrow(
        new InvalidTransaction('VIN in edit data must match VIN requested'),
      );
    });

    it('should throw InvalidTransaction when attempting to add files using editClaim', async () => {
      await expect(
        client.editClaim('12345', {
          files: [{ hash: '12342', name: 'foo.txt', status: 0 }],
        }),
      ).rejects.toThrow(
        new InvalidTransaction('Files can not be modified using this endpoint'),
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
            miles: 0,
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
          miles: 0,
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
