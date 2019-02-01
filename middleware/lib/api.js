'use strict';

const request = require('request-promise-native');
const protobuf = require('sawtooth-sdk/protobuf');

const { get } = request.defaults({
  baseUrl: 'http://rest-api:8008',
  json: true,
});

const { post } = request.defaults({
  baseUrl: 'http://rest-api:8008',
  headers: { 'Content-Type': 'application/octet-stream' },
});

/**
 * @typedef {object} Paging
 * @prop {string} start         - Start address.
 * @prop {number} limit         - Limit of pages.
 * @prop {string} next_position - Next address.
 * @prop {string} next          - URL to next item.
 */

/**
 * @typedef {object} GetBlocksParams
 * @prop {string} [head]       - Index or id of head block.
 * @prop {string} [start]      - Id to start paging (inclusive).
 * @prop {number} [limit=1000] - Number of items to return.
 * @prop {boolean} [reverse]   - If the list should be reversed.
 */

/**
 * @typedef {object} GetStateParams
 * @prop {string} [address]    - Partial address to filter leaves by.
 * @prop {string} [head]       - Index or id of head block.
 * @prop {string} [start]      - Id to start paging (inclusive).
 * @prop {number} [limit=1000] - Number of items to return.
 * @prop {boolean} [reverse]   - If the list should be reversed.
 */

/**
 * @typedef {object} GetStateItemResponse
 * @prop {string} data - Base64 encoded string of state data for the individual item.
 * @prop {string} head - The item's address.
 * @prop {string} link - URL that resolves to the state for this item.
 */

/**
 * @typedef {object} GetStateResponse
 * @prop {Array<{ address: string; data: string; }>} data - Array of encoded state items, data is base64 encoded string.
 * @prop {string} head                                    - Address of head block.
 * @prop {string} link                                    - URL that resolves to head block.
 * @prop {Paging} paging                                  - Paging for response.
 */

/**
 * @typedef {object} GetStatusResponse
 * @prop {{ endpoint: string; peers: Array<{ endpoint: string }>; }} data - Validator status data.
 * @prop {string} link                                                    - Link to this endpoint.
 */

/**
 * @typedef {object} PostBatchesResponse
 * @prop {string} link - URL to a `/batch_statuses` endpoint to be polled to check the status of submitted batches.
 */

/**
 * Retrieves a single item from the blockchain.
 *
 * @param {string} address - The item's address.
 * @return {Promise<GetStateItemResponse>}
 */
exports.getStateItem = async address => get(`/state/${address}`);

/**
 * Retrives a list of items from the blockchain.
 *
 * @param {GetStateParams} [qs] - Query parameters for the `GET /state` endpoint.
 * @return {Promise<GetStateResponse>}
 */
exports.getState = async qs => get('/state', { qs });

/**
 * Fetches information pertaining to the status of the validator.
 *
 * @return {Promise<GetStatusResponse>}
 */
exports.getStatus = async () => get('/status');

/**
 * Sends 1 or more batches to the validator to be handled and returns the response.
 *
 * @param {import('protobufjs').Message[]} batches - 1 or more batches to be sent.
 * @return {Promise<PostBatchesResponse>}
 */
exports.sendBatches = async (...batches) =>
  post('/batches', { body: protobuf.BatchList.encode({ batches }).finish() });
