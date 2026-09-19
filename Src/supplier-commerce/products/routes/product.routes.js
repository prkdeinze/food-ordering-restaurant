const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { validateProduct } = require('../middleware/product.middleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', validateProduct, productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
