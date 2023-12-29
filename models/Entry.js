const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  glbFile: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Entry", entrySchema);
