const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { authorizeAdmin } = require('../middlewares/authenticateMiddleware');
const validateObjectId = require('../middlewares/validateObjectIdMiddleware');
const soundsController = require('../controllers/sleeping_sounds.controller');
const { newSoundsValidation, updateSoundsvalidation } = require('../validation/sleep.validation');



// -------------------------------------- all Sounds routes ----------------------
router.post(
	'/createSound',
	authorizeAdmin,
	upload.single('cover'),
	validationMiddleware(newSoundsValidation),
	soundsController.createSounds
);
router.get('/getall', soundsController.getAllSounds);


router.get('/get-one/:id', validateObjectId, soundsController.getSound);

	router.patch('/update-atricle/:id',authorizeAdmin,validationMiddleware(updateSoundsvalidation),soundsController.updateSounds)
	router.delete('/delete-article/:id',authorizeAdmin,soundsController.deleteSounds)


module.exports = router;
