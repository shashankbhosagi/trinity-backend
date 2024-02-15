const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  feedback: {
    type: String,
    required: true,
  },
  tagWord: {
    type: String,
    required: true,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  projectLink: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Entry", entrySchema);
