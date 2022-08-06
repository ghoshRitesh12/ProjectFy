const router = require('express').Router();
const noteController = require('../controllers/noteController');

router.route('/')
  .get(noteController.getNote);


module.exports = router;
