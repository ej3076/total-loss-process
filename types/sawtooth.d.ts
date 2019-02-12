declare namespace Sawtooth {
  namespace API {
    interface Paging {
      /**
       * Start address.
       */
      start: string;
      /**
       * Limit of pages.
       */
      limit: number;
      /**
       * Next address.
       */
      next_position: string;
      /**
       * URL to next item.
       */
      next: string;
    }

    interface GetBlocksParams {
      /**
       * Index or id of head block.
       */
      head?: string;
      /**
       * Id to start paging (inclusive).
       */
      start?: string;
      /**
       * Number of items to return.
       * @defaultValue 1000
       */
      limit?: number;
      /**
       * Should the list should be reversed.
       */
      reverse?: boolean;
    }

    interface GetStateParams {
      /**
       * Partial address to filter leaves by.
       */
      address?: string;
      /**
       * Index or id of head block.
       */
      head?: string;
      /**
       * Id to start paging (inclusive).
       */
      start?: string;
      /**
       * Number of items to return.
       * @defaultValue 1000
       */
      limit?: number;
      /**
       * Should the list should be reversed.
       */
      reverse?: boolean;
    }

    interface GetStateItemResponse {
      /**
       * Base64 encoded string of state data for the individual item.
       */
      data: string;
      /**
       * The item's address.
       */
      head: string;
      /**
       * URL that resolves to the state for this item.
       */
      link: string;
    }

    interface GetStateResponse {
      /**
       * Array of state items.
       */
      data: Array<{
        /**
         * Address of item on the blockchain.
         */
        address: string;
        /**
         * Base64 encoded string of encoded data.
         */
        data: string;
      }>;
      /**
       * Address of head block.
       */
      head: string;
      /**
       * URL that resolves to head block.
       */
      link: string;
      /**
       * Paging for response.
       */
      paging: Paging;
    }

    interface GetStatusResponse {
      /**
       * Validator status data.
       */
      data: {
        endpoint: string;
        peers: Array<{ endpoint: string }>;
      };
      /**
       * Link to this endpoint.
       */
      link: string;
    }

    interface PostBatchesResponse {
      /**
       * URL to a `/batch_statuses` endpoint to be polled to check the status
       * of submitted batches.
       */
      link: string;
    }
  }

  namespace Processor {
    class Context {
      /**
       * Queries the validator state for data at each of the addresses in the
       * given list. The addresses that have been set are returned in a list.
       *
       * NOTE: Values in the returned object are either a buffer, if the key
       * exists, or an empty array if they don't exist.
       */
      getState<T extends string>(
        addresses: T[],
        timeout?: number,
      ): Promise<{ [k in T]: Buffer | any[] }>;
      /**
       * Requests that each address in the provided dictionary be set in
       * validator state to its corresponding value. A list is returned
       * containing the successfully set addresses.
       */
      setState<T extends Record<string, Buffer>, U extends keyof T>(
        state: T,
        timeout?: number,
      ): Promise<[U]>;
      /**
       * Requests that each of the provided addresses be unset in validator
       * state. A list of successfully deleted addresses is returned.
       */
      deleteState<T extends string>(
        addresses: T[],
        timeout?: number,
      ): Promise<[T]>;
      /**
       * Add a blob to the execution result for this transaction.
       */
      addReceiptData(data: Buffer, timeout?: number): Promise<void | Error>;
      /**
       * Add a new event to the execution result for this transaction.
       */
      addEvent(
        eventType: string,
        attributes?: Array<string[]>,
        data?: Buffer,
        timeout?: number,
      ): Promise<void | Error>;
    }
  }

  namespace Protobuf {
    type Message<T> = import('protobufjs').Message<T> & T;

    interface BatchHeader {
      /**
       * Public key for the client that signed the BatchHeader.
       */
      signerPublicKey: string;
      /**
       * List of `Transaction.header_signatures` that match the order of
       * transactions required for the batch.
       */
      transactionIds: string[];
    }

    interface Batch {
      /**
       * The serialized version of the BatchHeader.
       */
      header: Buffer;
      /**
       * The signature derived from signing the header.
       */
      headerSignature: string;
      /**
       * A list of the transactions that match the list of transaction_ids listed
       * in the batch header.
       */
      transactions: Message<Transaction>;
      /**
       * A debugging flag which indicates this batch should be traced through the
       * system, resulting in a higher level of debugging output.
       */
      trace: boolean;
    }

    interface TransactionHeader {
      /**
       * Public key for the client who added this transaction to a batch.
       */
      batcherPublicKey: string;
      /**
       * A list of transaction signatures that describe the transactions that
       * must be processed before this transaction can be valid.
       */
      dependencies: string[];
      /**
       * The family name correlates to the transaction processor's family name
       * that this transaction can be processed on.
       */
      familyName: string;
      /**
       * The family version correlates to the transaction processor's family
       * version that this transaction can be processed on.
       */
      familyVersion: string;
      /**
       * A list of addresses that are given to the context manager and control
       * what addresses the transaction processor is allowed to read from.
       */
      inputs: string[];
      /**
       * A random string that provides uniqueness for transactions with otherwise
       * identical fields.
       */
      nonce: string;
      /**
       * A list of addresses that are given to the context manager and control
       * what addresses the transaction processor is allowed to write to.
       */
      outputs: string[];
      /**
       * The sha512 hash of the encoded payload.
       */
      payloadSha512: string;
      /**
       * Public key for the client that signed the TransactionHeader.
       */
      signerPublicKey: string;
    }

    interface Transaction {
      header: TransactionHeader;
      /**
       * The signature derived from signing the header.
       */
      headerSignature: string;
      /**
       * The encoded family specific information of the transaction.
       */
      payload: Buffer;
    }
  }

  namespace Signing {
    abstract class Key {
      constructor();
      /**
       * Returns the private key bytes in a Buffer.
       */
      asBytes(): Buffer;
      /**
       * Return the private key encoded as a hex string
       */
      asHex(): string;
      /**
       * Returns the algorithm name used for this private key.
       */
      getAlgorithmName(): string;
    }

    abstract class Context {
      /**
       * Returns the algorithm name used for this context.
       */
      getAlgorithmName(): string;
      /**
       * Produce a public key for the given private key.
       */
      getPublicKey(privateKey: Key): Key;
      /**
       * Generate a new random private key, based on the underlying algorithm.
       */
      newRandomPrivateKey(): Key;
      /**
       * Sign a message.
       *
       * Given a private key for this algorithm, sign the given message bytes
       * and return a hex-encoded string of the resulting signature.
       */
      sign(message: Buffer, privateKey: Key): string;
      /**
       * Verifies that a signature of a message was produced with the associated
       * public key.
       */
      verify(signature: string, message: Buffer, publicKey: Key): boolean;
    }

    class CryptoFactory {
      constructor(context: Context);
      /**
       * Returns the context associated with this factory.
       */
      getContext(): Context;
      /**
       * Create a new signer for the given private key.
       */
      newSigner(privateKey: Key): Signer;
    }

    class Secp256k1PrivateKey extends Key {
      constructor(privateKeyBytes: Buffer);
      /**
       * Creates a private key from a hex encode set of bytes.
       */
      static fromHex(hex: string): Secp256k1PrivateKey;
      /**
       * Generate a random private key.
       */
      static newRandom(): Secp256k1PrivateKey;
    }

    class Signer {
      constructor(context: Context, privateKey: Key);
      /**
       * Return the public key for this Signer instance.
       */
      getPublicKey(): Key;
      /**
       * Signs the given message.
       */
      sign(message: Buffer): string;
    }
  }
}
