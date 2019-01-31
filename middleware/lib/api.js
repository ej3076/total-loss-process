'use strict';
const { promisify } = require('util');
const request = require('request');
const protobuf = require('sawtooth-sdk/protobuf');

const get = promisify(
  request.defaults({
    baseUrl: 'http://rest-api:8008',
    json: true,
  }).get,
);
const post = promisify(
  request.defaults({
    baseUrl: 'http://rest-api:8008',
    headers: { 'Content-Type': 'application/octet-stream' },
    json: true,
  }).post,
);

/**
 * @typedef {import('request').Response} Response
 */

/**
 * @typedef {object} GetBlocksParams
 * @prop {string}  [head]       - Index or id of head block.
 * @prop {string}  [start]      - Id to start paging (inclusive).
 * @prop {number}  [limit=1000] - Number of items to return.
 * @prop {boolean} [reverse]    - If the list should be reversed.
 */

/**
 * @typedef {object} GetStateParams
 * @prop {string}  [address]    - Partial address to filter leaves by.
 * @prop {string}  [head]       - Index or id of head block.
 * @prop {string}  [start]      - Id to start paging (inclusive).
 * @prop {number}  [limit=1000] - Number of items to return.
 * @prop {boolean} [reverse]    - If the list should be reversed.
 */

/**
 * Retrieves a list of blocks.
 *
 * @param {GetBlocksParams} qs - Query parameters for the `GET /blocks` endpoint.
 * @return {Promise<Response>}
 */
exports.getBlocks = async qs => get('/blocks', { qs });

/**
 * Retrieves a single item from the blockchain.
 *
 * @param {string} address - The item's address.
 * @return {Promise<Response>}
 */
exports.getStateItem = async address => get(`/state/${address}`);

/**
 * Retrives a list of items from the blockchain.
 *
 * @param {GetStateParams} qs - Query parameters for the `GET /state` endpoint.
 * @return {Promise<Response>}
 */
exports.getState = async qs => get('/state', { qs });

/**
 * Fetches information pertaining to the status of the validator.
 *
 * @return {Promise<Response>}
 */
exports.getStatus = async () => get('/status');

/**
 * Sends 1 or more batches to the validator to be handled and returns the response.
 *
 * @param {Message[]} batches - 1 or more batches to be sent.
 * @return {Promise<Response>}
 */
exports.sendBatches = async (...batches) => {
  const body = protobuf.BatchList.encode({ batches }).finish();
  return post('/batches', { body });
};
