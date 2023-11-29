const Sounds = require('../models/sleep_sounds.model');
const asyncHandler = require('express-async-handler');
const { infoLogger } = require('../services/infoLoggerService');
const { paginate } = require('../utils/pagination');

const SoundsController = {
	getAllSounds: asyncHandler(async (req, res) => {
		const userRole = req.user?.role;

		let queryRole = {};
		if (userRole == 'Admin') {
			queryRole = {};
		} else {
			queryRole = { isPublished: true };
		}

		const { error, data, pagination } = await paginate(Sounds, req, queryRole);
		if (error) {
			return res.status(404).json({ success: false, error });
		}

		res.status(200).json({ success: true, data, pagination });
	}),

	getSound: asyncHandler(async (req, res) => {
		const userRole = req.user?.role;

		let queryRole = {};
		if (userRole == 'Admin') {
			queryRole = {};
		} else {
			queryRole = { isPublished: true };
		}

		const Sounds = await Sounds.findOne({ _id: req.params.id, ...queryRole });
		if (!Sounds) {
			return res.status(404).json({ success: false, error: 'Sound not found' });
		}

		res.status(200).json({ success: true, data: Sounds });
	}),

	createSounds: asyncHandler(async (req, res) => {
		if (req.file) {
			req.body.file = `/Sounds/${req.file.filename}`;
		}

		let status = false;
		if (req.body?.publish_date) {
			status = new Date(req.body?.publish_date) <= Date.now();
		} else {
			status = req.body?.isPublished;
		}

		const newSounds = new Sounds({
			...req.body,
			isPublished: status,
		});

		if (!newSounds) {
			return res.status(400).json({
				success: false,
				message: 'Something went wrong while create Sounds',
			});
		}

		const savedSounds = await newSounds.save();
		res.status(201).json({
			success: true,
			data: savedSounds,
			message: 'Sound was created successfully',
		});
		infoLogger.info(
			`Sounds ${savedSounds?.title} | ${savedSounds?._id} | Sounds was created successfully by user ${req.user?._id}`
		);
	}),

	updateSounds: asyncHandler(async (req, res) => {
		if (req.file) {
			req.body.cover = `/Sounds/${req.file.filename}`;
		}
		const { id } = req.params;

		// const Sounds = await Sounds.findById(_id);

		// if (!Sounds) {
		// 	return res.status(404).json({ success: false, error: 'Sounds not found' });
		// }

		// if (userId !== Sounds.creatorId && !req.user.isAdmin) {
		// 	return res.status(403).json({ error: 'Permission denied' });
		// }

		let status = false;
		if (req.body?.publish_date) {
			status = new Date(req.body?.publish_date) <= Date.now();
		} else {
			status = req.body?.isPublished;
		}
		const updatedSounds = await Sounds.findByIdAndUpdate(
			{_id: id},
			{ ...req.body, isPublished: status },
			{ new: true }
		);

		if (!updatedSounds) {
			return res.status(404).json({ success: false, error: 'Sounds not found' });
		}

		res.status(201).send({
			success: true,
			data: updatedSounds,
			message: 'Sounds was updated successfully',
		});
		infoLogger.info(
			`Sounds ${updatedSounds?.title} | ${updatedSounds?._id} | Sounds was updated successfully by user ${req.user?._id}`
		);
	}),

	deleteSounds: asyncHandler(async (req, res) => {
		const { id } = req.params;

		const deletedSounds = await Sounds.findByIdAndDelete({ _id: id });

		if (!deletedSounds) {
			return res.status(404).json({ success: false, error: 'Sounds not found' });
		}

		res.status(201).json({
			success: true,
			message: 'Sounds was deleted successfully',
		});
		infoLogger.info(
			`Sounds ${deletedSounds?.title} | ${deletedSounds?._id} | Sounds was deleted successfully by user ${req.user?._id}`
		);
	}),
};

module.exports = SoundsController;

// ------------------------------ auto Update Sounds Status------------------------
exports.autoUpdateSoundsStatus = async (req, res) => {
	try {
		const currentDate = new Date();
		const draftSoundss = await Sounds.find({ isPublished: false });

		if (!draftSoundss) return null;

		for (const Sounds in draftSoundss) {
			if (Sounds.publish_date >= currentDate) {
				await Sounds.updateOne(
					{ _id: Sounds?._id },
					{ $set: { isPublished: true } }
				);
				infoLogger.info(
					`Sounds ${Sounds?.title} | ${Sounds?._id} | isPublished auto updated from  false 'draft' to true 'published'`
				);
			}
		}
	} catch (error) {
		error.message = 'something went wrong while auto update Sounds isPublished';
		if (process.env.NODE_ENV == 'development') {
			console.log(error);
		}
		errorLogger.error(error);
	}
};
