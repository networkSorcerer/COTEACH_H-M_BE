const orderController = {};
const { populate } = require("dotenv");
const Order = require("../models/Order");
const productController = require("./product.controller");
const randomStringGenerator = require("../utils/randomStringGenerator");

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;
    // 재고 확인 & 재고 업데이트
    const insufficientStockItems = await productController.checkItemListStock(
      orderList
    );

    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems
        .reduce((total, item) => total + item.message + " ", "")
        .trim();

      throw new Error(errorMessage);
    }

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();
    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getCart = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    res.status(200).json({
      status: "success",
      data: cart?.items || [],
      cartItemQty: cart.items.length,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.deleteCartItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.userId;
    const cart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ status: "fail", error: "Cart not found" });
    }

    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateCart = async (req, res) => {
  try {
    const itemId = req.params.id;
    const qty = req.body.qty;
    const userId = req.userId;

    const cart = await Cart.findOneAndUpdate(
      { userId: userId, "items._id": itemId }, // userId와 배열 내 아이템 _id 조건
      { $set: { "items.$.qty": qty } }, // 해당 아이템 qty 필드만 업데이트
      { new: true }
    );
    if (!cart) throw new Error("item doesn't exist");

    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};
module.exports = orderController;
