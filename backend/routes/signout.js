const router = require('express').Router();
const signoutController = require('../controllers/signoutController');

router.route('/')
  .get((req, res) => {
    return res.redirect('back');
  })
  .post(signoutController);

module.exports = router;
