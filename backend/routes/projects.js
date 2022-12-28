const router = require('express').Router();
const projectsController = require('../controllers/projectsController');

router.get('/', projectsController.getAllProjects);
router.post('/create', projectsController.createProject);
router.post('/delete/:projectID', projectsController.deleteProject);
router.post('/gen-sharelink/:projectID', projectsController.genShareLink);
router.post('/make-sharelink-private/:projectID', projectsController.makeShareLinkPrivate);

module.exports = router;
