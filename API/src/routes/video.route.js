const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { authorizeAdmin, authenticate } = require('../middlewares/authenticateMiddleware');
const validateObjectId = require('../middlewares/validateObjectIdMiddleware');
const videoController = require('../controllers/video.controller');
const { newVideoValidation, updateVideoValidation } = require('../validation/video.validation');



// -------------------------------------- all videos routes ----------------------
router.post(
	'/',
	authorizeAdmin,
	upload.single('cover'),
	validationMiddleware(newVideoValidation),
	videoController.createVideo
);
router.get('/', authenticate, videoController.getAllVideos);


// single videos routes operations --
router.get('/:id', authenticate, validateObjectId, videoController.getVideo);

router
	.route('/:id')
	.all(authorizeAdmin, validateObjectId)
	.patch(
		upload.single('cover'),
		validationMiddleware(updateVideoValidation),
		videoController.updateVideo
	)
	.delete(videoController.deleteVideo);

module.exports = router;
