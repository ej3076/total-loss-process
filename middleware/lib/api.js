'use strict';

const request = require('request-promise-native');
const sawtooth = require('sawtooth-sdk/protobuf');

const REST_API_HOSTNAME = process.env.REST_API_HOSTNAME || 'rest-api';

const { get } = request.defaults({
  baseUrl: `http://${REST_API_HOSTNAME}:8008`,
  json: true,
});

const { post } = request.defaults({
  baseUrl: `http://${REST_API_HOSTNAME}:8008`,
  headers: { 'Content-Type': 'application/octet-stream' },
});

/**
 * Retrieves a single item from the blockchain.
 *
 * @param {string} address - The item's address.
 * @return {Promise<Sawtooth.API.GetStateItemResponse>}
 */
exports.getStateItem = async address => get(`/state/${address}`);

/**
 * Retrives a list of items from the blockchain.
 *
 * @param {Sawtooth.API.GetStateParams} [qs] - Query parameters for the `GET /state` endpoint.
 * @return {Promise<Sawtooth.API.GetStateResponse>}
 */
exports.getState = async qs => get('/state', { qs });

/**
 * Fetches information pertaining to the status of the validator.
 *
 * @return {Promise<Sawtooth.API.GetStatusResponse>}
 */
exports.getStatus = async () => get('/status');

/**
 * Sends 1 or more batches to the validator to be handled and returns the
 * response as an unparsed JSON string.
 *
 * @param {import('protobufjs').Message[]} batches - 1 or more batches to be sent.
 * @return {Promise<string>}
 */
exports.sendBatches = async (...batches) =>
  post('/batches', { body: sawtooth.BatchList.encode({ batches }).finish() });

/**
 * Helper method that takes a response from `postBatches` and pings the
 * returned link until it either commits or errors.
 *
 * @param {Sawtooth.API.PostBatchesResponse} response - Response from the `POST /batches` endpoint.
 * @param {number} [interval=100] - Interval to ping link endpoint.
 * @return {Promise<void>}
 */
exports.pingBatchResponse = ({ link }, interval = 100) => {
  if (typeof link !== 'string') {
    throw new Error('Batch response link not found in response object');
  }
  const url = new URL(link);
  const endpoint = `${url.pathname}${url.search}`;
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      /**
       * @type {Sawtooth.API.GetBatchStatusResponse}
       */
      const response = await get(endpoint);
      for (const batch of response.data) {
        if (batch.status !== 'PENDING') {
          clearInterval(intervalId);
          switch (batch.status) {
            case 'COMMITTED':
              return resolve();
            case 'INVALID':
              return reject(new Error(batch.invalid_transactions[0].message));
            case 'UNKNOWN':
            default:
              return reject(new Error('Batch status unable to be resolved.'));
          }
        }
      }
    }, interval);
  });
};
