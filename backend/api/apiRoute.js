const router = require('express').Router();
const themeController = require('./controllers/themeController');
const getSignature = require('./controllers/signatureController');
const queryController = require('./controllers/queryController');

router.post('/themechange', themeController);

router.post('/get-signature', getSignature);

router.post('/ready-query-src', queryController.readyQueryResults);

router.post('/search/:query', queryController.handleQuery);

module.exports = router;
