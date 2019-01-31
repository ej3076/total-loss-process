'use strict';

const { createHash } = require('crypto');

const VEHICLE_FAMILY = 'vechicle';

const VEHICLE_NAMESPACE = hash(VEHICLE_FAMILY).substring(0, 6);

module.exports = {
  VEHICLE_FAMILY,
  VEHICLE_NAMESPACE,
  /**
   * Given a VIN number generate and return a block address.
   *
   * @param {string} vin The vin number of interest.
   * @returns {string} A block address.
   */
  addressFromVIN(vin) {
    return `${VEHICLE_NAMESPACE}${hash(vin)}`;
  },
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
    .toLowerCase()
    .substring(0, 64);
}
