'use strict';

const router = require('express').Router();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const AUTH0_BASE = 'https://total-loss-process.auth0.com';

/**
 * Auth0 JWT authentication middleware.
 */
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `${AUTH0_BASE}/.well-known/jwks.json`,
  }),
  audience: `${AUTH0_BASE}/api/v2/`,
  issuer: `${AUTH0_BASE}/`,
  algorithms: ['RS256'],
});

/**
 * Ensure a user private key was supplied in the request headers and set it on
 * the request for easy consumption.
 */
function requirePrivateKey(req, _res, next) {
  if (!req.headers.private_key) {
    throw new Error('User private key required.');
  }
  req.privateKey = req.headers.private_key;
  next();
}

router.use(checkJwt, requirePrivateKey);

module.exports = router;
