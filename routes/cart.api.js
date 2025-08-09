const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart.controller");
router.post("/", cartController.addItemToCart);

module.exports = router;
