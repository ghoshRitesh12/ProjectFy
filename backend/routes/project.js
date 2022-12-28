const router = require('express').Router();
const projectController = require('../controllers/projectController');
const overviewController = require('../controllers/overviewController');
// const ideasController
// const kanbanController

router.get('/', (req, res) => res.redirect('back'));

router.get('/:projectID', (req, res) => {
  res.redirect(`${req.baseUrl}${req.url}/overview`);
});

// show one project
router.get('/:projectID/:subSection', projectController.getProject);

// modify overview content
router.post('/:projectID/overview/edit/:changedElementName', overviewController.modifyOverview);


module.exports = router;
