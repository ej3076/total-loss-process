'use strict';

const router = require('express').Router();
const multer = require('multer');

const ClaimClient = require('../lib/claim-client');
const authMiddleware = require('../lib/middleware/auth');

const getFiles = multer().array('files[]');

// Retrieve a list of claims from the blockchain.
router.get('/', async (_, res) => {
  try {
    const client = new ClaimClient();
    const claimsList = await client.listClaims();
    console.log(claimsList);
    res.send(claimsList);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Retrieve a claim from the blockchain using VIN.
router.get('/:vin', async (req, res) => {
  try {
    const client = new ClaimClient();
    const claimList = await client.getClaim(req.params.vin);
    console.log(claimList);
    res.send(claimList);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Insert a new claim into the blockchain.
router.post('/', authMiddleware, async (req, res) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const response = await client.createClaim(req.body);
    console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Edit an existing claim on the blockchain using VIN.
router.post('/:vin', authMiddleware, async (req, res) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const response = await client.editClaim(req.params.vin, req.body);
    console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Add images to a claim using the Detailed Claim view.
router.post('/:vin/files', authMiddleware, getFiles, async (req, res) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const response = await client.addFiles(req.params.vin, req.files);
    console.log(response);
    res.send(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Get a single file from S3.
router.get('/:vin/files/:filename', authMiddleware, async (req, res, next) => {
  try {
    const client = new ClaimClient(req.privateKey);
    const hashQuery = req.query.hash;
    if (!hashQuery) {
      throw new Error('Hash query required');
    }
    const s3request = client.getFile(
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
    console.log(err);
    res.sendStatus(500);
  }
});

// Archive a single file from a claim.
router.post(
  '/:vin/files/:filename/archive',
  authMiddleware,
  async (req, res) => {
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
      console.log(err);
      res.sendStatus(500);
    }
  },
);

// Restore a single file from a claim.
router.post(
  '/:vin/files/:filename/restore',
  authMiddleware,
  async (req, res) => {
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
      console.log(err);
      res.sendStatus(500);
    }
  },
);

module.exports = router;
