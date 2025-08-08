const Product = require("../models/Product");
const PAGE_SIZE = 1;
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
    let response = { state: "success" };
    const pageNumber = parseInt(page, 10);
    console.log("page:", page, "pageNumber:", pageNumber);

    if (!isNaN(pageNumber) && pageNumber > 0) {
      console.log("if문 진입함");
      query = query.skip((pageNumber - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.countDocuments(cond);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    } else {
      console.log("if문 진입 안 함");
    }

    const productList = await query.exec();
    response.data = productList;
    console.log("response to client:", response);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
