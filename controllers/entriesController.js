const Entry = require("../models/Entry");
const fs = require("fs");

const {
  createFolder,
  uploadFileToDrive,
  generatePublicUrl,
  upload, // Include Multer instance
} = require("../utils/helper");
const formidable = require("formidable");

const sendData = (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      const name = fields.name[0];
      const feedback = fields.feedback[0];
      const folderId = await createFolder(name);

      const thumbnailFile = files.thumbnail[0];
      const glbFile = files.glbFile[0];

      const thumbnailFilePath = thumbnailFile.filepath;
      const glbFilePath = glbFile.filepath;

      const thumbnailFileId = await uploadFileToDrive(
        thumbnailFile.originalFilename,
        thumbnailFile.mimetype,
        folderId,
        fs.readFileSync(thumbnailFilePath)
      );

      const glbFileId = await uploadFileToDrive(
        glbFile.originalFilename,
        glbFile.mimetype,
        folderId,
        fs.readFileSync(glbFilePath)
      );

      const thumbnailUrl = await generatePublicUrl(thumbnailFileId);
      const glbUrl = await generatePublicUrl(glbFileId);

      const newEntry = new Entry({
        name,
        feedback,
        thumbnailImage: thumbnailUrl,
        glbFile: glbUrl,
      });

      const savedEntry = await newEntry.save();
      res
        .status(201)
        .json({ message: "Data submitted successfully", data: savedEntry });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to parse form data." });
    }
  });
};
const getAllData = async (req, res) => {
  try {
    const entries = await Entry.find();
    // if (entries == [] || entries.length === 0) {
    //   return res.status(204).json({ message: "No data to show" });
    // }
    res.status(200).json({ message: "All data retrived!", data: entries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSingleData = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Data Retrived!", data: entry });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
const increaseLike = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    entry.likes += 1;

    const updatedEntry = await entry.save();

    res.status(200).json({ message: "Likes Increased !", data: updatedEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const decreaseLike = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.likes > 0) {
      entry.likes -= 1;

      const updatedEntry = await entry.save();

      res
        .status(200)
        .json({ message: "Decrease like works!!", data: updatedEntry });
    } else {
      res.status(400).json({ message: "Like count cannot be negative" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  sendData,
  getAllData,
  getSingleData,
  increaseLike,
  decreaseLike,
};
