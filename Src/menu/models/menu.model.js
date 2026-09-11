const crypto = require("crypto");

class MenuModel {
  constructor({
    id,
    name,
    description = "",
    price = 0,
    category = "",
    image = "",
    isAvailable = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id || crypto.randomUUID();

    this.name =
      typeof name === "string"
        ? name.trim()
        : "";

    this.description =
      typeof description === "string"
        ? description.trim()
        : "";

    this.price =
      typeof price === "number"
        ? price
        : 0;

    this.category =
      typeof category === "string"
        ? category.trim()
        : "";

    this.image =
      typeof image === "string"
        ? image.trim()
        : "";

    this.isAvailable =
      typeof isAvailable === "boolean"
        ? isAvailable
        : true;

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  update(data = {}) {
    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "image",
      "isAvailable",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });

    if (typeof data.name === "string") {
      this.name = data.name.trim();
    }

    if (typeof data.description === "string") {
      this.description = data.description.trim();
    }

    if (typeof data.category === "string") {
      this.category = data.category.trim();
    }

    if (typeof data.image === "string") {
      this.image = data.image.trim();
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  updateAvailability(isAvailable) {
    if (typeof isAvailable !== "boolean") {
      throw new Error("Availability must be true or false");
    }

    this.isAvailable = isAvailable;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      image: this.image,
      isAvailable: this.isAvailable,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = MenuModel;
