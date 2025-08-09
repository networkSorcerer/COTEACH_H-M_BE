const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.controller");
const authController = require("../controller/auth.controller");

router.post("/", authController.authenticate, cartController.addItemToCart);

router.get("/", authController.authenticate, cartController.getCart);

module.exports = router;
