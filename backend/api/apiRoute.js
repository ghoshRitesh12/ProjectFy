const router = require('express').Router();
const themeController = require('./controllers/themeController');
const getSignature = require('./controllers/signatureController');

router.post('/themechange', themeController)

router.post('/get-signature', getSignature)

module.exports = router;

