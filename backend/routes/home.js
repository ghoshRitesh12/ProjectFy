const router = require('express').Router();
const homeController = require('../controllers/homeController');

const  { userAuth } = require('../middlewares/userAuth');

router.route('/')
  // .get(userAuth, homeController.getHome);
  .get(homeController.getHome);

module.exports = router;
