const { createContext } = require('sawtooth-sdk/signing');
const router = require('express').Router();

router.post('/generate', (req, res) => {
  const context = createContext('secp256k1');
  const privateKey = context.newRandomPrivateKey();
  const publicKey = context.getPublicKey(privateKey);
  res.json({
    private_key: privateKey.asHex(),
    public_key: publicKey.asHex(),
  });
});

module.exports = router;
