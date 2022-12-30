const router = require('express').Router();
const settingsController = require('../controllers/settingsController');

router.get('/', settingsController.getProfileSettings);

router.post('/profileNameChange', settingsController.profileNameChange);

router.post('/deleteAccount', settingsController.deleteAccount);

router.post('/profile-pic', settingsController.changeProfilePic);


module.exports = router;
