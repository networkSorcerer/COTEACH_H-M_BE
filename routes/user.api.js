const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
console.log("POST /user route hit");
router.post("/", userController.createUser);
router.get("/me", authController.authenticate, userController.getUser); // 토큰이 valid한 토큰인지, 이 token가지고 유저를 찾아서 리턴

module.exports = router;
