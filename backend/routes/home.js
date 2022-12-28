const router = require('express').Router();
const homeController = require('../controllers/homeController');

router.route('/')
  .get(homeController.getHome);


module.exports = router;
