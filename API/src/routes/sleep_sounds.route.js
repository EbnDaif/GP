const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { authorizeAdmin, authenticate } = require('../middlewares/authenticateMiddleware');
const validateObjectId = require('../middlewares/validateObjectIdMiddleware');
const soundsController = require('../controllers/sleeping_sounds.controller');
const { newSoundsValidation, updateSoundsvalidation } = require('../validation/sleep.validation');



// -------------------------------------- all Sounds routes ----------------------
router.post(
	'/',
	authorizeAdmin,
	upload.single('cover'),
	validationMiddleware(newSoundsValidation),
	soundsController.createSounds
);
router.get('/', authenticate, soundsController.getAllSounds);


// single Sounds routes operations --
router.get('/:id', authenticate, validateObjectId, soundsController.getSound);

router
	.route('/:id')
	.all(authorizeAdmin, validateObjectId)
	.patch(
		upload.single('cover'),
		validationMiddleware(updateSoundsvalidation),
		soundsController.updateSounds
	)
	.delete(soundsController.deleteSounds);

module.exports = router;
