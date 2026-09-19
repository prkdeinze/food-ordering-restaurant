const SupplierProduct = require("../models/product.model");

class ProductService {
  constructor() {
    this.products = [];
  }

  createProduct(data) {
    const product = new SupplierProduct(data);
    this.products.push(product);
    return product;
  }

  getAllProducts() {
    return this.products;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(
      (product) => String(product.id) === String(id)
    ) || null;
  }

  getProductsBySupplier(supplierId) {
    return this.products.filter(
      (product) => String(product.supplierId) === String(supplierId)
    );
  }

  updateProduct(id, data) {
    const index = this.products.findIndex(
      (product) => String(product.id) === String(id)
    );

    if (index === -1) return null;

    this.products[index] = new SupplierProduct({
      ...this.products[index],
      ...data,
      id: this.products[index].id,
      updatedAt: new Date().toISOString()
    });

    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(
      (product) => String(product.id) === String(id)
    );

    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }
}

module.exports = new ProductService();
