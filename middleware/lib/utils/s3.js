'use strict';

const S3 = require('aws-sdk/clients/s3');

const { loadType } = require('./proto');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const Bucket = 'ford-capstone-wayne-state';

const s3 = new S3(
  IS_PRODUCTION
    ? undefined
    : {
        endpoint: 'http://aws:4572',
        s3ForcePathStyle: true,
      },
);

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
    .getObject({ Bucket, Key: `${vin}/${name}`, IfMatch: hash })
    .promise();
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
      Bucket,
      CopySource: `${vin}/${from}`,
      Key: `${vin}/${to}`,
    })
    .promise();
  await s3
    .deleteObject({
      Bucket,
      Key: `${vin}/${from}`,
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
  const { buffer: Body, originalname: name } = file;
  const { ETag: hash } = await s3
    .upload({
      Bucket,
      Key: `${vin}/${name}`,
      Body,
    })
    .promise();
  return {
    hash,
    name,
    status: ACTIVE,
  };
};
