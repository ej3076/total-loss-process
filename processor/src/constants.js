'use strict';

const { createFamily } = require('./utils');

const { FAMILY_NAME, FAMILY_NAMESPACE, calculateAddress } = createFamily(
  'vehicle',
);

exports.VEHICLE_FAMILY = FAMILY_NAME;
exports.VEHICLE_NAMESPACE = FAMILY_NAMESPACE;
/**
 * Given a VIN number generate and return a block address.
 *
 * @param {string} vin The vin number of interest.
 * @returns {string} A block address.
 */
exports.addressFromVIN = vin => calculateAddress(vin);
