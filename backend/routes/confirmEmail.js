const router = require('express').Router();
const confirmEmailHandler = require('../controllers/confirmEmailController');


router.route('/:token')
  .get(confirmEmailHandler)

module.exports = router;
