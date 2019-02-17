'use strict';

const router = require('express').Router();

const ClaimClient = require('../lib/claim-client');
const authMiddleware = require('../lib/middleware/auth');

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
router.post('/claims', authMiddleware, async (req, res) => {
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

module.exports = router;
