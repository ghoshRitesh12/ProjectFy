const router = require('express').Router();
const refreshTokenController = require('../controllers/refreshTokenController');

router.route('/')
  .get(refreshTokenController);

module.exports = router;
