const router = require('express').Router();
const signupController = require('../controllers/signupController');
const signedIn = require('../middlewares/signedIn');

const { check } = require('express-validator');

const validateFields = [
  check('firstName')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("First name can't be empty"),
  check('emailId')
    .trim()
    .isEmail()
    .withMessage('Invalid Email address'),
  check('password')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Password can't be empty")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()])(?=.{8,16}$)/)
    .withMessage('Use 8 to 16 characters with a mix of letters, numbers & symbols'),
  check('confirmPassword')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Confirm password can't be empty")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*()])(?=.{8,16}$)/)
    .withMessage('Use 8 to 16 characters with a mix of letters, numbers & symbols')
    .custom((value, { req }) => {
      if(value !== req.body.password)
        throw new Error("Those passwords didn't match. Try again.");

      return true;
    })
];

router.route('/')
  .get(signedIn, signupController.showSignup)
  .post(validateFields, signupController.handleSignup)

module.exports = router;
