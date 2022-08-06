const router = require('express').Router();
const signoutController = require('../controllers/signoutController');

router.route('/')
  .post(signoutController);

module.exports = router;
