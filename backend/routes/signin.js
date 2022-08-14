const router = require('express').Router();
const signinController = require('../controllers/signinController');
const signedIn = require('../middlewares/signedIn');

router.route('/')
  .get(signedIn, signinController.showSignin)
  .post(signinController.handleSignin)
  
// router.route('/account')
//   .post(signinController.handleSignin)

module.exports = router;
