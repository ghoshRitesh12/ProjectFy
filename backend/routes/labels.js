const router = require('express').Router();
const labelsController = require('../controllers/labelsController');

router.get('/', labelsController.getAllLabels);
router.post('/create', labelsController.createLabel);
router.post('/delete/:labelID', labelsController.deleteLabel);

module.exports = router;
