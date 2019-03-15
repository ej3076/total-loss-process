'use strict';

const createFamily = require('../../../utils/family');

const { FAMILY_NAME, FAMILY_NAMESPACE, calculateAddress } = createFamily(
  'claim',
);

exports.CLAIM_FAMILY = FAMILY_NAME;
exports.CLAIM_NAMESPACE = FAMILY_NAMESPACE;
/**
 * Given a VIN number generate and return a block address.
 *
 * @param {string} vin - The vin number of interest.
 * @returns {string} A block address.
 */
exports.addressFromVIN = vin =>
  calculateAddress(vin.replace(/[^A-Za-z0-9]/g, '').toUpperCase());
