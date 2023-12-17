const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const  createFolderIfNotExists = (folderPath) => {
	if (!fs.existsSync(folderPath)) {
	  fs.mkdirSync(folderPath);
	}
	return
	
  };


const storageEngine = multer.diskStorage({

	destination: async function (req, file, cb) {
		let dest;
		switch (req.baseUrl) {
			case '/GP/v1.0/users':
				dest = 'src/uploads/users';
				 createFolderIfNotExists(dest);

				break;
			case '/GP/v1.0/sounds':
				dest = 'src/uploads/sounds';
				  createFolderIfNotExists(dest);


				break;
			case '/GP/v1.0/article':
				dest = 'src/uploads/articles';
				 await createFolderIfNotExists(dest);


				break;
			case '/GP/v1.0/videos':
				dest = 'src/uploads/videos';
				 await createFolderIfNotExists(dest);


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
	let fileTypes = /jpeg|jpg|png|gif|svg|mp4|mp3/;
	if (type == 'file') {
		fileTypes = /jpeg|jpg|png|gif|svg|mp4|mp3/;
	}
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimeType = fileTypes.test(file.mimetype);
	if (mimeType && extName) {
		return cb(null, true);
	} else {
		cb('Error: You can Only Upload an Image OR Videos OR Sounds!!');
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