'use strict';

const router = require('express').Router();
const multer = require('multer');

const ClaimClient = require('../lib/claim-client');
const authMiddleware = require('../lib/middleware/auth');

const getFiles = multer().array('files[]');

// Delete a claim from the blockchain.
router.delete('/:vin', authMiddleware, async (req, res, next) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const deletedClaims = await client.deleteClaim(req.params.vin);
    console.log(deletedClaims);
    res.send(deletedClaims);
  } catch (err) {
    return next(err);
  }
});

// Retrieve a list of claims from the blockchain.
router.get('/', async (_, res, next) => {
  try {
    const client = new ClaimClient();
    const claimsList = await client.listClaims();
    console.log(claimsList);
    res.send(claimsList);
  } catch (err) {
    return next(err);
  }
});

// Retrieve a claim from the blockchain using VIN.
router.get('/:vin', async (req, res, next) => {
  try {
    const client = new ClaimClient();
    const claimList = await client.getClaim(req.params.vin);
    console.log(claimList);
    res.send(claimList);
  } catch (err) {
    return next(err);
  }
});

// Insert a new claim into the blockchain.
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const response = await client.createClaim(req.body);
    console.log(response);
    res.send(response);
  } catch (err) {
    return next(err);
  }
});

// Edit an existing claim on the blockchain using VIN.
router.post('/:vin', authMiddleware, async (req, res, next) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const response = await client.editClaim(req.params.vin, req.body);
    console.log(response);
    res.send(response);
  } catch (err) {
    return next(err);
  }
});

// Add files to a claim using the Detailed Claim view.
router.post(
  '/:vin/files/new/:fileType',
  authMiddleware,
  getFiles,
  async (req, res, next) => {
    try {
      const client = new ClaimClient(req.privateKey);
      const response = await client.addFiles(
        req.params.vin,
        req.files,
        req.params.fileType,
      );
      console.log(response);
      res.send(response);
    } catch (err) {
      return next(err);
    }
  },
);

// Get a single file from S3.
router.get('/:vin/files/:filename', authMiddleware, async (req, res, next) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const hashQuery = req.query.hash;
    if (!hashQuery) {
      throw new Error('Hash query required');
    }
    const s3request = await client.getFile(
      req.params.vin,
      req.params.filename,
      hashQuery,
    );
    s3request.on('httpHeaders', (_, s3Headers) => {
      ['content-type', 'last-modified', 'etag', 'cache-control'].forEach(
        header => {
          res.set(header, s3Headers[header]);
        },
      );
    });
    s3request
      .createReadStream()
      .on('error', err => next(err))
      .pipe(res);
  } catch (err) {
    return next(err);
  }
});

// Archive a single file from a claim.
router.post(
  '/:vin/files/:filename/archive',
  authMiddleware,
  async (req, res, next) => {
    try {
      const client = new ClaimClient(req.privateKey);
      const response = await client.setFileStatus(
        req.params.vin,
        req.params.filename,
        'ARCHIVED',
      );
      console.log(response);
      res.send(response);
    } catch (err) {
      return next(err);
    }
  },
);

// Restore a single file from a claim.
router.post(
  '/:vin/files/:filename/restore',
  authMiddleware,
  async (req, res, next) => {
    try {
      const client = new ClaimClient(req.privateKey);
      const response = await client.setFileStatus(
        req.params.vin,
        req.params.filename,
        'ACTIVE',
      );
      console.log(response);
      res.send(response);
    } catch (err) {
      return next(err);
    }
  },
);

// Rename a single file in a claim.
router.post('/:vin/files/:filename', authMiddleware, async (req, res, next) => {
  try {
    if (typeof req.body.name !== 'string') {
      throw new Error('New file name string is required');
    }
    const client = new ClaimClient(req.privateKey);
    const response = await client.renameFile(
      req.params.vin,
      req.params.filename,
      req.body.name,
    );
    console.log(response);
    res.send(response);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
