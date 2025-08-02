const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
console.log("POST /user route hit");
router.post("/", userController.createUser);

module.exports = router;
