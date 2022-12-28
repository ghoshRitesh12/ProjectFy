const router = require('express').Router();
const publicProjectsController = require('../controllers/publicProjectController');

router.get('/', (req, res) => res.redirect('back'));

router.get('/project/:projectID', (req, res) => {
  res.redirect(`${req.baseUrl}${req.url}/overview`);
});

router.get(
  '/project/:projectID/:subSection', 
  publicProjectsController.getPublicProject
);

module.exports = router;
