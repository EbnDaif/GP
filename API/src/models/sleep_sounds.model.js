const mongoose = require('mongoose');
const { Schema } = mongoose;
const { deleteUploadedFile } = require('../utils/deleteUploadedFile');

const soundsSchema = new Schema({
  title: {
    type: String,
    required: [true, "please provide the Sounds category"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "please provide the Sounds category"],
    trim: true,
  },
  tags :[{
    type : String,
   required: [true, 'please provide the article category'],
   trim: true,
 }],
 

  description: {
    type: String,
    required: [true, "please provide the Sounds category"]
  },
  URL: {
    type: String,
    required: [true, "please provide the Sounds file"],
  },
  publish_date: Date,
  //file: String, // image
  /*publish_by: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },*/
  isPublished: {
    type: Boolean,
    default: false,
  },
});

soundsSchema.pre('findOneAndUpdate', deleteUploadedFile);
soundsSchema.pre('findOneAndDelete', deleteUploadedFile);

const Sounds = mongoose.model('Sounds', soundsSchema);

module.exports = Sounds;
