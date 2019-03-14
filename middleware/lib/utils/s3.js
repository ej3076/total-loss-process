'use strict';

const S3 = require('aws-sdk/clients/s3');

const { loadType } = require('../../../utils/proto');

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
  return s3.getObject({ Bucket, Key: `${vin}/${name}`, IfMatch: hash });
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
      CopySource: `${Bucket}/${vin}/${from}`,
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
 * @param {string} vin                                      - The VIN to associate the file with.
 * @param {Express.Multer.File} file                        - The file to upload.
 * @param {keyof typeof Protos.File.Type} [fileType='NONE'] - The type of the file.
 * @return {Promise<Protos.File>} The SHA512 hash digest of the file uploaded.
 */
exports.uploadFile = async (vin, file, fileType = 'NONE') => {
  const FileType = await loadType('File');
  const Status = FileType.getEnum('Status');
  const Type = FileType.getEnum('Type');
  if (Type[fileType] === undefined) {
    throw new Error(`Invalid file type provided: ${fileType}`);
  }
  const { buffer: Body, originalname: name } = file;
  const { ETag: hash } = await s3
    .upload({
      Bucket,
      Key: `${vin}/${name}`,
      Body,
      ContentType: file.mimetype,
    })
    .promise();
  return {
    hash,
    name,
    status: Status.ACTIVE,
    type: Type[fileType],
  };
};
