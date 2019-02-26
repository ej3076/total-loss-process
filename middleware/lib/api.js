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
 * Sends 1 or more batches to the validator to be handled and returns the response.
 *
 * @param {import('protobufjs').Message[]} batches - 1 or more batches to be sent.
 * @return {Promise<Sawtooth.API.PostBatchesResponse>}
 */
exports.sendBatches = async (...batches) =>
  post('/batches', { body: sawtooth.BatchList.encode({ batches }).finish() });
