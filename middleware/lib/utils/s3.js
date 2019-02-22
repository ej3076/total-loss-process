'use strict';

const S3 = require('aws-sdk/clients/s3');

const { loadType } = require('./proto');

const s3 = new S3({
  endpoint:
    process.env.NODE_ENV !== 'production' ? 'http://localhost:4572' : undefined,
});

/**
 * Given a VIN return the bucket name
 *
 * @param {string} vin - The VIN
 */
const getBucketName = vin => `ford-capstone-wayne-state/${vin}`;

/**
 * @typedef {import('aws-sdk').AWSError} AWSError
 */

/**
 * Get a single file from S3 or throw a 412 "Precondition Failed" if hashes don't match.
 *
 * @param {string} vin  - The VIN associated with the file.
 * @param {string} name - The filename.
 * @param {string} hash - The file's hash from the blockchain.
 * @throws {AWSError} Error with `statusCode` 412 if there is a mismatch in hashes.
 */
exports.getFile = (vin, name, hash) => {
  return s3
    .getObject({ Bucket: getBucketName(vin), Key: name, IfMatch: hash })
    .promise();
};

/**
 * Create a bucket if it doesn't exist.
 *
 * @param {string} vin - A VIN number to be used as the bucket name.
 */
exports.maybeCreateBucket = async vin => {
  const params = { Bucket: getBucketName(vin) };
  try {
    await s3.headBucket(params).promise();
    return;
  } catch (e) {
    if (e.code !== 'NoSuchBucket') {
      throw e;
    }
  }
  await s3.createBucket(params).promise();
};

/**
 * Rename a single file.
 *
 * @param {string} vin  - The VIN of the associated file.
 * @param {string} from - The current file name.
 * @param {string} to   - The new name of the file.
 */
exports.renameFile = async (vin, from, to) => {
  await s3
    .copyObject({
      Bucket: getBucketName(vin),
      CopySource: `${getBucketName(vin)}/${from}`,
      Key: to,
    })
    .promise();
  await s3
    .deleteObject({
      Bucket: getBucketName(vin),
      Key: from,
    })
    .promise();
};

/**
 * Upload a single file to s3.
 *
 * @param {string} vin               - The VIN to associate the file with.
 * @param {Express.Multer.File} file - The file to upload.
 * @return {Promise<Protos.File>} The SHA512 hash digest of the file uploaded.
 */
exports.uploadFile = async (vin, file) => {
  const { ACTIVE } = (await loadType('File')).getEnum('Status');
  const { ETag: hash } = await s3
    .upload({
      Bucket: getBucketName(vin),
      Key: file.originalname,
      Body: file.buffer,
    })
    .promise();
  return {
    hash,
    name,
    status: ACTIVE,
  };
};
