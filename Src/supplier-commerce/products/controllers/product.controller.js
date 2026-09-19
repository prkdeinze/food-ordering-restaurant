const productService = require('../services/product.service');

const getProducts = (req, res) => {
  const products = productService.getProducts();
  res.json({ success: true, data: products });
};

const getProduct = (req, res) => {
  const product = productService.getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({ success: true, data: product });
};

const createProduct = (req, res) => {
  const product = productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
};

const updateProduct = (req, res) => {
  const product = productService.updateProduct(req.params.id, req.body);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({ success: true, data: product });
};

const deleteProduct = (req, res) => {
  const deleted = productService.deleteProduct(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    message: 'Product deleted'
  });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
