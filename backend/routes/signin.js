const router = require('express').Router();
const signinController = require('../controllers/signinController');
const signedIn = require('../middlewares/signedIn');

const { check } = require('express-validator');

const validateFields = [
  check('emailId')
    .trim()
    .isEmail()
    .withMessage('Invalid Email address'),
  check('password')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Password can't be empty")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()])(?=.{8,16}$)/)
    .withMessage('Use 8 to 16 characters with a mix of letters, numbers & symbols')
];

router.route('/')
  .get(signedIn, signinController.showSignin)
  .post(validateFields, signinController.handleSignin)
  
// router.route('/account')
//   .post(signinController.handleSignin)

module.exports = router;

