'use strict';
const { createHash } = require('crypto');

const cbor = require('cbor');
const { AuthorizationException } = require('sawtooth-sdk/processor/exceptions');
const protobuf = require('sawtooth-sdk/protobuf');
const { createContext } = require('sawtooth-sdk/signing');

/**
 * @typedef {import('protobufjs').Message} Message
 */

/**
 * @typedef {import('sawtooth-sdk/signing').Signer} Signer
 */

/**
 * @typedef {(signer: Signer, action: string, data: Record<string, any>, extraHeaders: Partial<TransactionHeader>) => Message} TransactionCreator
 */

/**
 * @typedef {object} KeyPair
 * @prop {string} private_key - The private key.
 * @prop {string} public_key  - The public key.
 */

/**
 * @typedef {object} TransactionHeader
 * @prop {string}   familyName       - The transaction family name.
 * @prop {string}   familyVersion    - The transaction family versoin.
 * @prop {string[]} [inputs]         - Specific state addresses allowed to write to.
 * @prop {string[]} [outputs]        - Specific state addresses to read from.
 * @prop {string}   signerPublicKey  - The signer's public key.
 * @prop {string}   batcherPublicKey - The batcher's public key.
 * @prop {string[]} [dependencies]   - Transaction header signatures that must be applied before this one.
 * @prop {string}   payloadSha512    - The SHA512 signature of the payload.
 */

/**
 * Helper for creating a sawtooth batch.
 *
 * @param {Signer} signer - A signer instance.
 * @param {Message[]} transactionList - An array of transactions.
 * @return {Message}
 */
exports.createBatch = (signer, ...transactionList) => {
  if (!signer) {
    throw new AuthorizationException(
      'Signer private key must be provided to use this method.',
    );
  }
  const header = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactionList.map(
      ({ headerSignature }) => headerSignature,
    ),
  }).finish();
  const headerSignature = signer.sign(header);
  const transactions = protobuf.TransactionList.encode(
    transactionList,
  ).finish();
  return protobuf.Batch.create({
    header,
    headerSignature,
    transactions,
  });
};

/**
 * Helper that generates hash utilities for a given transaction family.
 *
 * @param {string} familyName - The family name.
 */
exports.familyHashUtils = familyName => {
  const FAMILY_NAMESPACE = hash(familyName).substring(0, 6);
  return {
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
 * Generates a new random secp256k1 keypair to assign to users.
 *
 * @return {KeyPair}
 */
exports.generateKeypair = () => {
  const context = createContext('secp256k1');
  const privateKey = context.newRandomPrivateKey();
  const publicKey = context.getPublicKey(privateKey);
  return {
    private_key: privateKey.asHex(),
    public_key: publicKey.asHex(),
  };
};

/**
 * Generates a transaction creator.
 *
 * @param {string} familyName    - The transaction family name.
 * @param {string} familyVersion - The transaction family version.
 * @return {TransactionCreator}
 */
exports.makeTransactionCreator = (familyName, familyVersion) => (
  signer,
  action,
  data,
  extraHeaders = {},
) => {
  if (!signer) {
    throw new AuthorizationException(
      'Signer private key must be provided to use this method.',
    );
  }
  const payload = cbor.encode({ action, data });
  const header = protobuf.TransactionHeader.encode({
    familyName,
    familyVersion,
    inputs: [],
    outputs: [],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512')
      .update(payload)
      .digest('hex'),
    ...extraHeaders,
  }).finish();
  const headerSignature = signer.sign(header);
  return protobuf.Transaction.create({
    header,
    headerSignature,
    payload,
  });
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
