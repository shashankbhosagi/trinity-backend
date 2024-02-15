const Entry = require("../models/Entry");

const sendData = async (req, res) => {
  try {
    const { name, mail, feedback, tagWord, thumbnailImage, projectLink } =
      req.body;
    const existingName = await Entry.findOne({ name });
    const existingMail = await Entry.findOne({ mail });

    if (existingName) {
      return res.status(404).json({ message: "User name already exists!" });
    }

    if (existingMail) {
      return res.status(404).json({ message: "User mail already exists!" });
    }

    const newProject = new Entry({
      name,
      mail,
      feedback,
      tagWord,
      thumbnailImage,
      projectLink,
    });

    // Save the new team to the database
    const savedProject = await newProject.save();

    res
      .status(201)
      .json({ message: "Project added successfully.", project: savedProject });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Fail to save!", error: error.message });
  }
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

const getPaginationData = async (req, res) => {
  try {
    // Get current page number from the query parameters
    const currPageNumber = parseInt(req.query.page);

    const pageLimit = 11;

    // Calculate the skip value based on the current page and page limit
    const skip = currPageNumber * pageLimit;

    // Query the database using skip and limit
    const entries = await Entry.find().skip(skip).limit(pageLimit);

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getEntriesCount = async (req, res) => {
  try {
    // Get the total number of entries
    const totalEntries = await Entry.countDocuments();
    res.status(200).json(totalEntries);
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
  getPaginationData,
  getEntriesCount,
};
