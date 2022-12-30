const router = require('express').Router();
const projectController = require('../controllers/projectController');
const overviewController = require('../controllers/overviewController');
const ideasController = require('../controllers/ideasController');
const kanbanController = require('../controllers/kanbanController');

router.get('/', (req, res) => res.redirect('back'));

router.get('/:projectID', (req, res) => {
  res.redirect(`${req.baseUrl}${req.url}/overview`);
});

// show one project
router.get('/:projectID/:subSection', projectController.getProject);

// for overview content
router.post('/:projectID/overview/edit/:changedElementName', overviewController.modifyOverview);


// for ideas items 
router.post('/:projectID/ideas/create', ideasController.createIdea);

router.post('/:projectID/ideas/edit/:ideaID', ideasController.editIdea);

router.post('/:projectID/ideas/delete/:ideaID', ideasController.deleteIdea);



// for kanban items
router.post('/:projectID/kanban/:kanbanSection/create', kanbanController.createKanban);

router.post('/:projectID/kanban/:kanbanSection/edit/:kanbanID', kanbanController.editKanban);

router.post('/:projectID/kanban/:kanbanSection/moveto/:kanbanID', kanbanController.shiftKanban);

router.post('/:projectID/kanban/:kanbanSection/delete/:kanbanID', kanbanController.deleteKanban);


module.exports = router;
