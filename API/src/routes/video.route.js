const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { authorizeAdmin, authenticate } = require('../middlewares/authenticateMiddleware');
const validateObjectId = require('../middlewares/validateObjectIdMiddleware');
const videoController = require('../controllers/video.controller');
const { newVideoValidation, updateVideoValidation } = require('../validation/video.validation');




router.post(
	'/createvideo',
	authorizeAdmin,
	upload.single('cover'),
	validationMiddleware(newVideoValidation),
	videoController.createVideo
);
router.get('/getall', authenticate, videoController.getAllVideos);


router.get('/get-one/:id', authenticate, validateObjectId, videoController.getVideo);

	router.patch('/update-atricle/:id',authorizeAdmin,validationMiddleware(updateVideoValidation),videoController.updateVideo)
	router.delete('/delete-article/:id',authorizeAdmin,videoController.deleteVideo)


module.exports = router;
