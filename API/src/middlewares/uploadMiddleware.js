const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require ("fs")

const destinations=['videos','atricles','sounds','users']
 function make_folders(dest){
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest);
		console.log(`Folder created at: ${dest}`);
	  } else {
		console.log(`Folder already exists at: ${dest}`);
	  }}
const storageEngine = multer.diskStorage({
	destination: async function (req, file, callback) {
		let dest ="src/uploads/";
		await make_folders(dest)
		switch (req.baseUrl) {
			case '/GP/v1.0/users':
				dest = 'src/uploads/users';
				await make_folders(dest)
				break;
			case '/GP/v1.0/sounds':
				dest = 'src/uploads/sounds';
				await make_folders(dest)


				break;
			case '/GP/v1.0/article':
				dest = 'src/uploads/articles';
				await make_folders(dest)



				break;
			case '/GP/v1.0/videos':
				dest = 'src/uploads/videos';
				await make_folders(dest)




				break;
			default:
				dest = 'uploads';

		}
		callback(null, dest);
	},

	filename: (req, file, callback) => {
		 let name=file.originalname.replace(" ","_")
		callback(null, `${Date.now()}--${uuidv4()}--${name}`);
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
