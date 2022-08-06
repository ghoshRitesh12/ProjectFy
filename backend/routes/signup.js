const router = require('express').Router();
const signupController = require('../controllers/signupController');
const signedIn = require('../middlewares/signedIn');

router.route('/')
  .get(signedIn ,signupController.showSignup)
  .post(signupController.handleSignup)

module.exports = router;
