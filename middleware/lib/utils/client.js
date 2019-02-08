'use strict';

const { createHash, randomBytes } = require('crypto');

const { AuthorizationException } = require('sawtooth-sdk/processor/exceptions');
const sawtooth = require('sawtooth-sdk/protobuf');
const { createContext } = require('sawtooth-sdk/signing');

/**
 * @template T
 * @typedef {import('protobufjs').Message<T> & T} Message
 */

/**
 * @typedef {import('sawtooth-sdk/signing').Signer} Signer
 */

/**
 * @typedef {(signer: Signer, payload: Buffer|Uint8Array, extraHeaders: Partial<TransactionHeader>) => Message<Transaction>} TransactionCreator
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
  const header = sawtooth.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map(({ headerSignature }) => headerSignature),
  }).finish();
  const headerSignature = signer.sign(header);
  return sawtooth.Batch.create({
    header,
    headerSignature,
    transactions,
  });
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
  payload,
  extraHeaders = {},
) => {
  if (!signer) {
    throw new AuthorizationException(
      'Signer private key must be provided to use this method.',
    );
  }
  const header = sawtooth.TransactionHeader.encode({
    familyName,
    familyVersion,
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    payloadSha512: createHash('sha512')
      .update(payload)
      .digest('hex'),
    ...extraHeaders,
    nonce: randomBytes(64).toString('hex'),
  }).finish();
  const headerSignature = signer.sign(header);
  return sawtooth.Transaction.create({
    header,
    headerSignature,
    payload,
  });
};
