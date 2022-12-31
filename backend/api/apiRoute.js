const router = require('express').Router();
const themeController = require('./controllers/themeController');
const getSignature = require('./controllers/signatureController');
const handleQuery = require('./controllers/queryController');

router.post('/themechange', themeController)

router.post('/get-signature', getSignature)

router.post('/search/:query', handleQuery)

module.exports = router;
