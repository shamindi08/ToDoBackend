const express = require("express");
const router = express.Router();
const { getUserDetails, updateUser } = require("../controllers/userController");

// Get User Details
router.get("/:id", getUserDetails);

// Update User
router.put("/:id", updateUser);

module.exports = router;
