'use strict';
const router = require('express').Router();

const { generateKeypair } = require('../lib/client-utils');

router.post('/generate', (_, res) => {
  res.json(generateKeypair);
});

module.exports = router;
