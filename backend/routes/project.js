const router = require('express').Router();
const projectController = require('../controllers/projectController');

router.route('/:projectId/:section')
  .get(projectController.getProject);


module.exports = router;
