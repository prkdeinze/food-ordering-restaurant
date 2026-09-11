
const crypto = require("crypto");

class InventoryModel {
  constructor({
    id,
    name,
    quantity = 0,
    unit = "piece",
    minimumStock = 0,
    price = 0,
    supplier = null,
    sku = null,
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id || crypto.randomUUID();

    this.name =
      typeof name === "string"
        ? name.trim()
        : "";

    this.quantity =
      typeof quantity === "number"
        ? quantity
        : 0;

    this.unit =
      typeof unit === "string"
        ? unit.trim().toLowerCase()
        : "piece";

    this.minimumStock =
      typeof minimumStock === "number"
        ? minimumStock
        : 0;

    this.price =
      typeof price === "number"
        ? price
        : 0;

    this.supplier = supplier;
    this.sku = sku;
    this.isActive = isActive;

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  isLowStock() {
    return this.quantity <= this.minimumStock;
  }

  updateStock(quantity) {
    if (
      typeof quantity !== "number" ||
      quantity < 0
    ) {
      throw new Error("Invalid stock quantity");
    }

    this.quantity = quantity;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  addStock(amount) {
    if (
      typeof amount !== "number" ||
      amount <= 0
    ) {
      throw new Error("Invalid stock amount");
    }

    this.quantity += amount;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  removeStock(amount) {
    if (
      typeof amount !== "number" ||
      amount <= 0
    ) {
      throw new Error("Invalid stock amount");
    }

    if (amount > this.quantity) {
      throw new Error("Insufficient stock");
    }

    this.quantity -= amount;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  update(data = {}) {
    const allowedFields = [
      "name",
      "quantity",
      "unit",
      "minimumStock",
      "price",
      "supplier",
      "sku",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });

    if (data.name) {
      this.name = data.name.trim();
    }

    if (data.unit) {
      this.unit = data.unit
        .trim()
        .toLowerCase();
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      unit: this.unit,
      minimumStock: this.minimumStock,
      price: this.price,
      supplier: this.supplier,
      sku: this.sku,
      isActive: this.isActive,
      lowStock: this.isLowStock(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = InventoryModel;
