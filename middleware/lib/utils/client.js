'use strict';

const { createHash, randomBytes } = require('crypto');

const sawtooth = require('sawtooth-sdk/protobuf');
const { createContext } = require('sawtooth-sdk/signing');

/**
 * @template T
 * @typedef {import('protobufjs').Message<T> & T} Message
 */

/**
 * @typedef {(signer: Sawtooth.Signing.Signer, payload: Buffer|Uint8Array, extraHeaders: Partial<Sawtooth.Protobuf.TransactionHeader>) => Message<Sawtooth.Protobuf.Transaction>} TransactionCreator
 */

/**
 * Helper for creating a sawtooth batch.
 *
 * @param {Sawtooth.Signing.Signer} signer                       - A signer instance.
 * @param {Sawtooth.Protobuf.Batch['transactions']} transactions - An array of transactions.
 * @return {Message<Sawtooth.Protobuf.Batch>}
 */
exports.createBatch = (signer, ...transactions) => {
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
 * @return {{ private_key: string; public_key: string; }}
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
