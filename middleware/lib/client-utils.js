'use strict';

const { createHash, randomBytes } = require('crypto');

const { encode } = require('cbor');
const { AuthorizationException } = require('sawtooth-sdk/processor/exceptions');
const protobuf = require('sawtooth-sdk/protobuf');
const { createContext } = require('sawtooth-sdk/signing');

/**
 * @template T
 * @typedef {import('protobufjs').Message<T> & T} Message
 */

/**
 * @typedef {import('sawtooth-sdk/signing').Signer} Signer
 */

/**
 * @typedef {(signer: Signer, action: string, data: Record<string, any>, extraHeaders: Partial<TransactionHeader>) => Message<Transaction>} TransactionCreator
 */

/**
 * @typedef {object} KeyPair
 * @prop {string} private_key - The private key.
 * @prop {string} public_key  - The public key.
 */

/**
 * @typedef {object} BatchHeader
 * @prop {string} signerPublicKey  - Public key for the client that signed the BatchHeader.
 * @prop {string[]} transactionIds - List of transaction.header_signatures that match the order of transactions required for the batch.
 */

/**
 * @typedef {object} TransactionHeader
 * @prop {string} batcherPublicKey - Public key for the client who added this transaction to a batch.
 * @prop {string[]} dependencies   - A list of transaction signatures that describe the transactions that must be processed before this transaction can be valid.
 * @prop {string} familyName       - The family name correlates to the transaction processor's family name that this transaction can be processed on, for example `intkey`.
 * @prop {string} familyVersion    - The family version correlates to the transaction processor's family version that this transaction can be processed on, for example `1.0`.
 * @prop {string[]} inputs         - A list of addresses that are given to the context manager and control what addresses the transaction processor is allowed to read from.
 * @prop {string} nonce            - A random string that provides uniqueness for transactions with otherwise identical fields.
 * @prop {string[]} outputs        - A list of addresses that are given to the context manager and control what addresses the transaction processor is allowed to write to.
 * @prop {string} payloadSha512    - The sha512 hash of the encoded payload.
 * @prop {string} signerPublicKey  - Public key for the client that signed the TransactionHeader.
 */

/**
 * @typedef {object} Batch
 * @prop {Buffer} header                       - The serialized version of the BatchHeader.
 * @prop {string} headerSignature              - The signature derived from signing the header.
 * @prop {Message<Transaction>[]} transactions - A list of the transactions that match the list of transaction_ids listed in the batch header.
 * @prop {boolean} [trace]                     - A debugging flag which indicates this batch should be traced through the system, resulting in a higher level of debugging output.
 */

/**
 * @typedef {object} Transaction
 * @prop {Buffer} header          - The serialized version of the TransactionHeader.
 * @prop {string} headerSignature - The signature derived from signing the header.
 * @prop {Buffer} payload         - The encoded family specific information of the transaction.
 */

/**
 * Helper for creating a sawtooth batch.
 *
 * @param {Signer} signer - A signer instance.
 * @param {Message<Transaction>[]} transactions - An array of transactions.
 * @return {Message<Batch>}
 */
exports.createBatch = (signer, ...transactions) => {
  if (!signer) {
    throw new AuthorizationException(
      'Signer private key must be provided to use this method.',
    );
  }
  const header = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map(({ headerSignature }) => headerSignature),
  }).finish();
  const headerSignature = signer.sign(header);
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
  const payload = encode({ action, data });
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
    nonce: randomBytes(64).toString('hex'),
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
