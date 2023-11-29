const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const storageEngine = multer.diskStorage({
	destination: function (req, file, cb) {
		let dest;
		switch (req.baseUrl) {
			case '/GP/v1.0/users':
				dest = 'src/uploads/users';
				break;
			case 'src/uploads/sounds':
				dest = 'src/uploads/sounds';
				break;
			case '/GP/v1.0/articles':
				dest = 'src/uploads/articles';
				break;
			default:
				dest = 'uploads';
		}
		cb(null, dest);
	},

	filename: (req, file, cb) => {
		// cb(null, `${Date.now()}--${uuidv4()}--${file.originalname}`);
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}--${uuidv4()}${ext}`);
	},
});
const checkFileType = function (file, cb, type = 'image') {
	console.log('type', type);
	let fileTypes = /jpeg|jpg|png|gif|svg/;
	if (type == 'file') {
		fileTypes = /jpeg|jpg|png|gif|mp4|mp3|svg/;
	}
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimeType = fileTypes.test(file.mimetype);
	if (mimeType && extName) {
		return cb(null, true);
	} else {
		cb('Error: You can Only Upload an Image!!');
	}
};

const upload = multer({
	storage: storageEngine,
	limits: { fileSize: 10000000 },
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
});

const uploadFile = multer({
	storage: storageEngine,
	limits: { fileSize: 10000000 },
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb, 'file');
	},
});

module.exports = { upload, uploadFile };