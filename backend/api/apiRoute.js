const router = require('express').Router();
const themeController = require('./controllers/themeController');

router.route('/themechange')
  .post(themeController)

module.exports = router;

