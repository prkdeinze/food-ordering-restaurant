class SupplierProduct {
  constructor(data = {}) {
    const now = new Date().toISOString();

    this.id = data.id || `product-${Date.now()}`;

    // Supplier ownership
    this.supplierId = data.supplierId || null;
    this.supplierSku = data.supplierSku || "";

    // Product information
    this.name = data.name || "";
    this.slug = data.slug || "";
    this.description = data.description || "";
    this.brand = data.brand || "";
    this.category = data.category || "";

    // Pricing
    this.supplierPrice = Number(data.supplierPrice || 0);
    this.sellingPrice = Number(data.sellingPrice || 0);
    this.currency = data.currency || "EUR";

    // Stock
    this.stockQuantity = Number(data.stockQuantity || 0);
    this.inStock =
      typeof data.inStock === "boolean"
        ? data.inStock
        : this.stockQuantity > 0;

    // Fulfilment
    this.supplierFulfilled =
      typeof data.supplierFulfilled === "boolean"
        ? data.supplierFulfilled
        : true;

    // Product media
    this.images = Array.isArray(data.images) ? data.images : [];

    // Marketplace status
    this.status = data.status || "draft";
    this.isActive =
      typeof data.isActive === "boolean" ? data.isActive : true;

    // Shipping
    this.weight = Number(data.weight || 0);
    this.shippingClass = data.shippingClass || "";

    this.createdAt = data.createdAt || now;
    this.updatedAt = data.updatedAt || now;
  }

  toJSON() {
    return {
      id: this.id,
      supplierId: this.supplierId,
      supplierSku: this.supplierSku,
      name: this.name,
      slug: this.slug,
      description: this.description,
      brand: this.brand,
      category: this.category,
      supplierPrice: this.supplierPrice,
      sellingPrice: this.sellingPrice,
      currency: this.currency,
      stockQuantity: this.stockQuantity,
      inStock: this.inStock,
      supplierFulfilled: this.supplierFulfilled,
      images: this.images,
      status: this.status,
      isActive: this.isActive,
      weight: this.weight,
      shippingClass: this.shippingClass,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = SupplierProduct;
