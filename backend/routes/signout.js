const router = require('express').Router();
const signoutController = require('../controllers/signoutController');

router.route('/')
  .get((req, res) => res.redirect('back'))
  .post(signoutController);

module.exports = router;
