const Product = require("../models/Product");

const productController = {};
productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    } = req.body;
    
    let productSku = await Product.findOne({ sku });
    if (productSku) {
      throw new Error("이미 존재하는 식별 코드 입니다.");
    }

    const product = new Product({
      sku,
      name,
      size,
      image,
      category,
      description,
      price,
      stock,
      status,
    });
    await product.save();
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page, name } = req.query;
    const cond = name ? { name: { $regex: name, $options: "i" } } : {};
    let query = Product.find(cond);
    const productList = await query.exec();
    // if (name) {
    //   const products = await Product.find({
    //     name: { $regex: name, $option: "i" },
    //   });
    // } else {
    //   const products = await Product.find({});
    // }

    res.status(200).json({ status: "success", productList });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
