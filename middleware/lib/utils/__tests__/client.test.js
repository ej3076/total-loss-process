'use strict';

const clientUtils = require('../client');

describe('Client utils', () => {
  it('should generate a keypair correctly', () => {
    expect(clientUtils.generateKeypair()).toEqual(
      expect.objectContaining({
        private_key: expect.any(String),
        public_key: expect.any(String),
      }),
    );
  });
});
