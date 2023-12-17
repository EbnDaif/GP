const { User } = require("../models/userModel");
const { paginate } = require("../utils/pagination");
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler');
module.exports = {
    getAllUsersCtrl: asyncHandler(async (req, res) => {
        const { error, data, pagination } = await paginate(User, req);
        if (error) return res.status(404).json({ success: false, error });
        res.status(200).json({ success: true, pagination, data });
    }),
    getOneUserCtrl: asyncHandler(async (req, res) => {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(404).json({ success: false, error: "user not found." })
        res.status(200).json({ success: true, data: user })
    }),
    updateUserProfileCtrl: asyncHandler(async (req, res) => {
        if (req.file) req.body.profileImage = `/users/${req.file.filename}`
        const userHimSelf = req.user._id.toString() === req.params.id.toString()
        if (!userHimSelf) return res.status(403).json({ success: false, error: "only users can update themselves" })
        if (req.body.mobileNumber) {
            const existingUser = await User.findOne({ _id: { $ne: req.params.id }, $or: [{ mobileNumber: req.body.mobileNumber }] });
            if (existingUser) return res.status(400).json({ success: false, error: `This MobileNumber already in use ..!` })
        }
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ success: false, error: "user not found." })
        res.status(200).json({ success: true, data: updatedUser });
    }),
        updateByAdminCtrl: asyncHandler(async (req, res) => {
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedUser });
    }),
    deleteUserCtrl: asyncHandler(async (req, res) => {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
        if (!deletedUser) return res.status(404).json({ success: false, error: "user not found." })
        res.status(200).json({ success: true, data: deletedUser._id });
    }),
    getCurrentUserCtrl: asyncHandler(async (req, res) => {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(404).json({ success: false, error: "user not found." })
        res.status(200).json({ success: true, data: user });
    })
}