'use strict';

const { join } = require('path');

const { load } = require('protobufjs');

/**
 * @typedef {import('protobufjs').Type & {[k: string]: any}} ProtobufType
 * @typedef {import('protobufjs').Root} ProtobufRoot
 */

/**
 * Loads and returns the Root of a given proto file.
 *
 * @param {string} filename - The name of the `.proto` file to load from.
 * @return {Promise<ProtobufRoot>}
 */
exports.loadRoot = async filename => {
  return load(join(__dirname, '../../../protos', filename));
};

/**
 * Loads and returns a protobuf type from the protos dir.
 *
 * @param {string} filename - The name of the `.proto` file to load from.
 * @param {string} typename - The name of the type to load.
 * @return {Promise<ProtobufType>}
 */
exports.loadType = async (filename, typename) => {
  const Root = await exports.loadRoot(filename);
  return Root.lookupType(typename);
};
