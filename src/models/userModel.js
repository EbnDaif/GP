const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { deleteUploadedFile } = require("../utils/deleteUploadedFile");

const userSchema = new Schema({
    password: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, required: true },
    city: { type: String },
    about: { type: String },
    email: { type: String, required: true},
    country: { type: String },
    nationality: { type: String },
    profileImage: { type: String },
    mobileNumber: { type: Number },
    accountStatus: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    role: { type: String, enum: ["Admin", "User", ], default: "User" },
}, { timestamps: true });

userSchema.pre('findOneAndUpdate', deleteUploadedFile)
userSchema.pre('findOneAndDelete', deleteUploadedFile)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, genSalt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateTokens = function () {
    const accessToken = jwt.sign({ _id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ _id: this._id, role: this.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });
    return {
        accessToken,
        refreshToken
    }
}

userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

const User = model("User", userSchema);
module.exports = { User }

