'use strict';

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const createFamily = require('../family');

describe('family utils', () => {
  it('should create family utilities correctly', () => {
    const family = createFamily('foobar');
    expect(family).toEqual(
      expect.objectContaining({
        FAMILY_NAME: 'foobar',
        FAMILY_NAMESPACE: expect.any(String),
        calculateAddress: expect.any(Function),
      }),
    );

    expect(family.calculateAddress('hello')).toEqual(expect.any(String));
  });

  it('should throw InvalidTransaction when calculateAddress not given a valid string', () => {
    /** @type {any} */
    const family = createFamily('foobar');
    expect(() => family.calculateAddress()).toThrow(
      new InvalidTransaction(
        'Must pass a non-empty string to calculateAddress function',
      ),
    );
    expect(() => family.calculateAddress(123)).toThrow(
      new InvalidTransaction(
        'Must pass a non-empty string to calculateAddress function',
      ),
    );
    expect(() => family.calculateAddress({})).toThrow(
      new InvalidTransaction(
        'Must pass a non-empty string to calculateAddress function',
      ),
    );
    expect(() => family.calculateAddress('')).toThrow(
      new InvalidTransaction(
        'Must pass a non-empty string to calculateAddress function',
      ),
    );
  });
});
