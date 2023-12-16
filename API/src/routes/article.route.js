const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { authorizeAdmin, authenticate } = require('../middlewares/authenticateMiddleware');
const validateObjectId = require('../middlewares/validateObjectIdMiddleware');
const articleController = require('../controllers/article.controller');
const { newArticleValidation, updateArticleValidation } = require('../validation/article.validation');



// -------------------------------------- all articles routes ----------------------
router.post(
	'/createArticle',
	authorizeAdmin,
	upload.single('cover'),
	validationMiddleware(newArticleValidation),
	articleController.createArticle
);
router.get('/getall', authenticate, articleController.getAllArticles);


router.get('/get-one/:id', authenticate, validateObjectId, articleController.getArticle);

	router.patch('/update-atricle/:id',authorizeAdmin,validationMiddleware(updateArticleValidation),articleController.updateArticle)
	router.delete('/delete-article/:id',authorizeAdmin,articleController.updateArticle)

module.exports = router;
