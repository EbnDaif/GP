const mongoose = require('mongoose');
const { Schema } = mongoose;
const { deleteUploadedFile } = require('../utils/deleteUploadedFile');

const videoSchema = new Schema({
  title: {
    type: String,
    required: [true, "please provide the Video category"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "please provide the Video category"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "please provide the Video content"],
  },
  URL: {
    type: String,
    required: [true, "please provide the Video content"],
  },
  tags :[{
    type : String,
   required: [true, 'please provide the article category'],
   trim: true,
 }],
 
  file: {
    type: String,
    required: [true, "please provide the Video content"],
  },  publish_date: Date,
  publish_by: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});

videoSchema.pre('findOneAndUpdate', deleteUploadedFile);
videoSchema.pre('findOneAndDelete', deleteUploadedFile);

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
