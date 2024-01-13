const express = require("express");
const router = express.Router();
const {
  sendData,
  getAllData,
  getSingleData,
  increaseLike,
  decreaseLike,
} = require("../controllers/entriesController");
const { contactUs } = require("../controllers/formsController");

router.route("/submit").post(sendData);
router.route("/all").get(getAllData);
router.route("/:id").get(getSingleData);
router.route("/:id/increaseLike").post(increaseLike);
router.route("/:id/decreaseLike").post(decreaseLike);
module.exports = router;
