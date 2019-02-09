'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const { load } = require('protobufjs');

const readdir = promisify(fs.readdir);

/**
 * @typedef {import('protobufjs').Type & Record<string, any>} ProtobufType
 * @typedef {import('protobufjs').Root} ProtobufRoot
 */

/**
 * Loads and returns the Root of a given proto file.
 *
 * @return {Promise<ProtobufRoot>}
 */
exports.loadRoot = async () => {
  const protosPath = path.join(__dirname, '../../protos');
  const protos = await readdir(protosPath).then(files =>
    files.map(name => path.join(protosPath, name)),
  );
  return load(protos);
};

/**
 * Loads and returns a protobuf type from the protos dir.
 *
 * @param {string} typename - The name of the type to load.
 * @return {Promise<ProtobufType>}
 */
exports.loadType = async (typename) => {
  const Root = await exports.loadRoot();
  return Root.lookupType(typename);
};
