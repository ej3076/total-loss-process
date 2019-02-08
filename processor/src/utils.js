'use strict';

const { createHash } = require('crypto');

/**
 * Helper that scaffolds out constants for new transaction families.
 *
 * @param {string} FAMILY_NAME - The family name.
 */
exports.createFamily = FAMILY_NAME => {
  const FAMILY_NAMESPACE = hash(FAMILY_NAME).substring(0, 6);
  return {
    FAMILY_NAME,
    FAMILY_NAMESPACE,
    /**
     * Calculates a block address using arbitrary string data.
     *
     * @param {string} data - Unique data to calculate a unique address.
     * @return {string} A calculated block address.
     */
    calculateAddress(data) {
      return `${FAMILY_NAMESPACE}${hash(data)}`;
    },
  };
};

/**
 * Generates a SHA-512 hash hex digest of a given string.
 *
 * @param {string} str The input string.
 * @returns {string} A trimmed substring of length 64 of the hash.
 */
function hash(str) {
  return createHash('sha512')
    .update(str)
    .digest('hex')
    .substring(0, 64);
}
