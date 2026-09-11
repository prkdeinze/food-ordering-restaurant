
const CouponModel = require("../models/coupon.model");

const coupons = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createCoupon = async (data = {}) => {
  if (!data.code) {
    throw createError("Coupon code is required", 400);
  }

  if (!data.discountType) {
    throw createError("Discount type is required", 400);
  }

  if (data.discountValue === undefined) {
    throw createError("Discount value is required", 400);
  }

  const code = data.code.trim().toUpperCase();

  const existingCoupon = Array.from(coupons.values()).find(
    (coupon) => coupon.code === code
  );

  if (existingCoupon) {
    throw createError(
      "Coupon with this code already exists",
      409
    );
  }

  const coupon = new CouponModel({
    ...data,
    code,
  });

  coupons.set(coupon.id, coupon);

  return coupon.toJSON();
};

const getAllCoupons = async () => {
  return Array.from(coupons.values()).map((coupon) =>
    coupon.toJSON()
  );
};

const getCouponById = async (id) => {
  const coupon = coupons.get(id);

  if (!coupon) {
    throw createError("Coupon not found", 404);
  }

  return coupon.toJSON();
};

const validateCoupon = async (code, orderAmount) => {
  if (!code) {
    throw createError("Coupon code is required", 400);
  }

  if (
    typeof orderAmount !== "number" ||
    orderAmount < 0
  ) {
    throw createError("Valid order amount is required", 400);
  }

  const normalizedCode = code.trim().toUpperCase();

  const coupon = Array.from(coupons.values()).find(
    (item) => item.code === normalizedCode
  );

  if (!coupon) {
    throw createError("Coupon not found", 404);
  }

  if (!coupon.isAvailable()) {
    throw createError(
      "Coupon is expired, inactive, or unavailable",
      400
    );
  }

  if (orderAmount < coupon.minOrderAmount) {
    throw createError(
      `Minimum order amount is ${coupon.minOrderAmount}`,
      400
    );
  }

  const discountAmount =
    coupon.calculateDiscount(orderAmount);

  const finalAmount = Number(
    Math.max(orderAmount - discountAmount, 0).toFixed(2)
  );

  return {
    coupon: coupon.toJSON(),
    orderAmount,
    discountAmount,
    finalAmount,
  };
};

const updateCoupon = async (id, data = {}) => {
  const coupon = coupons.get(id);

  if (!coupon) {
    throw createError("Coupon not found", 404);
  }

  if (data.code) {
    const normalizedCode =
      data.code.trim().toUpperCase();

    const duplicateCoupon =
      Array.from(coupons.values()).find(
        (item) =>
          item.code === normalizedCode &&
          item.id !== id
      );

    if (duplicateCoupon) {
      throw createError(
        "Coupon with this code already exists",
        409
      );
    }

    data.code = normalizedCode;
  }

  coupon.update(data);

  coupons.set(coupon.id, coupon);

  return coupon.toJSON();
};

const deleteCoupon = async (id) => {
  const coupon = coupons.get(id);

  if (!coupon) {
    throw createError("Coupon not found", 404);
  }

  coupons.delete(id);

  return true;
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
};
