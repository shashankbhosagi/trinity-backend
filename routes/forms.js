const express = require("express");
const router = express.Router();
const { contactUs, register } = require("../controllers/formsController");

router.route("/contact").post(contactUs);
router.route("/register").post(register);

module.exports = router;