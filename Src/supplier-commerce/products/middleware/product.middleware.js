const validateProduct = (req, res, next) => {
  const { name, supplierPrice, sellingPrice } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Product name is required'
    });
  }

  if (supplierPrice === undefined || sellingPrice === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Supplier price and selling price are required'
    });
  }

  next();
};

module.exports = {
  validateProduct
};
