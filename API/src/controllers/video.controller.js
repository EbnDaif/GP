const Video = require('../models/video.model');
const asyncHandler = require('express-async-handler');
const { infoLogger } = require('../services/infoLoggerService');
const { paginate } = require('../utils/pagination');

const videoController = {
	getAllVideos: asyncHandler(async (req, res) => {
		const userRole = req.user?.role;

		let queryRole = {};
		if (userRole == 'Admin') {
			queryRole = {};
		} else {
			queryRole = { isPublished: true };
		}

		const { error, data, pagination } = await paginate(Video, req, queryRole);
		if (error) {
			return res.status(404).json({ success: false, error });
		}

		res.status(200).json({ success: true, data, pagination });
	}),

	getVideo: asyncHandler(async (req, res) => {
		const userRole = req.user?.role;

		let queryRole = {};
		if (userRole == 'Admin') {
			queryRole = {};
		} else {
			queryRole = { isPublished: true };
		}

		const video = await Video.findOne({ _id: req.params.id, ...queryRole });
		if (!video) {
			return res.status(404).json({ success: false, error: 'Video not found' });
		}

		res.status(200).json({ success: true, data: video });
	}),

	createVideo: asyncHandler(async (req, res) => {
		if (req.file) {
			req.body.file = `/videos/${req.file.filename}`;
		}

		let status = false;
		if (req.body?.publish_date) {
			status = new Date(req.body?.publish_date) <= Date.now();
		} else {
			status = req.body?.isPublished;
		}

		const newVideo = new Video({
			...req.body,
			publish_by:req.user._id,
			isPublished: status,
		});

		if (!newVideo) {
			return res.status(400).json({
				success: false,
				message: 'Something went wrong while create video',
			});
		}

		const savedVideo = await newVideo.save();
		res.status(201).json({
			success: true,
			data: savedVideo,
			message: 'Video was created successfully',
		});
		infoLogger.info(
			`video ${savedVideo?.title} | ${savedVideo?._id} | Video was created successfully by user ${req.user?._id}`
		);
	}),

	updateVideo: asyncHandler(async (req, res) => {
		if (req.file) {
			req.body.cover = `/videos/${req.file.filename}`;
		}
		const { id } = req.params;

		// const video = await Video.findById(_id);

		// if (!video) {
		// 	return res.status(404).json({ success: false, error: 'Video not found' });
		// }

		// if (userId !== video.creatorId && !req.user.isAdmin) {
		// 	return res.status(403).json({ error: 'Permission denied' });
		// }

		let status = false;
		if (req.body?.publish_date) {
			status = new Date(req.body?.publish_date) <= Date.now();
		} else {
			status = req.body?.isPublished;
		}
		const updatedVideo = await Video.findByIdAndUpdate(
			{_id: id},
			{ ...req.body, isPublished: status },
			{ new: true }
		);

		if (!updatedVideo) {
			return res.status(404).json({ success: false, error: 'Video not found' });
		}

		res.status(201).send({
			success: true,
			data: updatedVideo,
			message: 'Video was updated successfully',
		});
		infoLogger.info(
			`video ${updatedVideo?.title} | ${updatedVideo?._id} | Video was updated successfully by user ${req.user?._id}`
		);
	}),

	deleteVideo: asyncHandler(async (req, res) => {
		const { id } = req.params;

		const deletedVideo = await Video.findByIdAndDelete({ _id: id });

		if (!deletedVideo) {
			return res.status(404).json({ success: false, error: 'Video not found' });
		}

		res.status(201).json({
			success: true,
			message: 'Video was deleted successfully',
		});
		infoLogger.info(
			`video ${deletedVideo?.title} | ${deletedVideo?._id} | Video was deleted successfully by user ${req.user?._id}`
		);
	}),
};

module.exports = videoController;

// ------------------------------ auto Update Video Status------------------------
exports.autoUpdateVideoStatus = async (req, res) => {
	try {
		const currentDate = new Date();
		const draftVideos = await Video.find({ isPublished: false });

		if (!draftVideos) return null;

		for (const video in draftVideos) {
			if (video.publish_date >= currentDate) {
				await Video.updateOne(
					{ _id: video?._id },
					{ $set: { isPublished: true } }
				);
				infoLogger.info(
					`video ${video?.title} | ${video?._id} | isPublished auto updated from  false 'draft' to true 'published'`
				);
			}
		}
	} catch (error) {
		error.message = 'something went wrong while auto update video isPublished';
		if (process.env.NODE_ENV == 'development') {
			console.log(error);
		}
		errorLogger.error(error);
	}
};
