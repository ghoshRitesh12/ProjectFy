const router = require('express').Router();
const settingsController = require('../controllers/settingsController');

router.get('/', settingsController.getProfileSettings);

// /profile-settings/profileNameChange
router.post('/profileNameChange', settingsController.profileNameChange);

router.post('/deleteAccount', settingsController.deleteAccount);

module.exports = router;
