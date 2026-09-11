const crypto = require("crypto");

class CouponModel {
  constructor({
    id,
    code,
    discountType,
    discountValue,
    minOrderAmount = 0,
    maxDiscountAmount = null,
    startDate = null,
    endDate = null,
    usageLimit = null,
    usedCount = 0,
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id || crypto.randomUUID();

    this.code =
      typeof code === "string"
        ? code.trim().toUpperCase()
        : "";

    this.discountType = discountType;
    this.discountValue = discountValue;

    this.minOrderAmount = minOrderAmount;
    this.maxDiscountAmount = maxDiscountAmount;

    this.startDate = startDate
      ? new Date(startDate).toISOString()
      : null;

    this.endDate = endDate
      ? new Date(endDate).toISOString()
      : null;

    this.usageLimit = usageLimit;
    this.usedCount = usedCount;
    this.isActive = isActive;

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  isAvailable() {
    if (!this.isActive) {
      return false;
    }

    const now = new Date();

    if (
      this.startDate &&
      now < new Date(this.startDate)
    ) {
      return false;
    }

    if (
      this.endDate &&
      now > new Date(this.endDate)
    ) {
      return false;
    }

    if (
      this.usageLimit !== null &&
      this.usedCount >= this.usageLimit
    ) {
      return false;
    }

    return true;
  }

  canApplyToOrder(orderAmount) {
    if (!this.isAvailable()) {
      return false;
    }

    if (
      typeof orderAmount !== "number" ||
      orderAmount < this.minOrderAmount
    ) {
      return false;
    }

    return true;
  }

  calculateDiscount(orderAmount) {
    if (!this.canApplyToOrder(orderAmount)) {
      return 0;
    }

    let discount = 0;

    if (this.discountType === "percentage") {
      discount =
        (orderAmount * this.discountValue) / 100;
    }

    if (this.discountType === "fixed") {
      discount = this.discountValue;
    }

    if (
      this.maxDiscountAmount !== null &&
      discount > this.maxDiscountAmount
    ) {
      discount = this.maxDiscountAmount;
    }

    if (discount > orderAmount) {
      discount = orderAmount;
    }

    return Number(discount.toFixed(2));
  }

  markAsUsed() {
    this.usedCount += 1;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  update(data = {}) {
    const allowedFields = [
      "code",
      "discountType",
      "discountValue",
      "minOrderAmount",
      "maxDiscountAmount",
      "startDate",
      "endDate",
      "usageLimit",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });

    if (data.code) {
      this.code = data.code
        .trim()
        .toUpperCase();
    }

    if (data.startDate) {
      this.startDate =
        new Date(data.startDate).toISOString();
    }

    if (data.endDate) {
      this.endDate =
        new Date(data.endDate).toISOString();
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      discountType: this.discountType,
      discountValue: this.discountValue,
      minOrderAmount: this.minOrderAmount,
      maxDiscountAmount: this.maxDiscountAmount,
      startDate: this.startDate,
      endDate: this.endDate,
      usageLimit: this.usageLimit,
      usedCount: this.usedCount,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = CouponModel;
