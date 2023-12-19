const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require ("fs").promises

const destinations=['Videos','atricles','sounds','users']
async function make_folders(dest){
			 destinations.forEach(async element => {
		try {
			await fs.mkdir(dest+element)
		} catch (error) {
			return
		}
				});
	

}
const storageEngine = multer.diskStorage({
	destination: async function (req, file, callback) {
		let dest ="src/uploads/";
		make_folders(dest)
		switch (req.baseUrl) {
			case '/GP/v1.0/users':
				dest = 'src/uploads/users';

				break;
			case '/GP/v1.0/sounds':
				dest = 'src/uploads/sounds';
				fs.mkdir(dest)


				break;
			case '/GP/v1.0/article':
				dest = 'src/uploads/articles';
				fs.mkdirSync(dest)



				break;
			case '/GP/v1.0/videos':
				dest = 'src/uploads/videos';
				



				break;
			default:
				dest = 'uploads';

		}
		callback(null, dest);
	},

	filename: (req, file, callback) => {
		callback(null, `${Date.now()}--${uuidv4()}--${file.originalname}`);
	},
});
const checkFileType = function (file, callback) {
	const fileTypes = /jpeg|jpg|png|gif|svg|mp4/;
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimeType = fileTypes.test(file.mimetype);
	if (mimeType && extName) {
		return callback(null, true);
	} else {
		callback('Error: You can Only Upload Images!!');
	}
};
const upload = multer({
	storage: storageEngine,
	limits: { fileSize: 10000000 },
	fileFilter: (req, file, callback) => {
		checkFileType(file, callback);
	},
});
module.exports = { upload };
