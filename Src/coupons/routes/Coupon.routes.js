
const express = require("express");

const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");

const {
  validateCouponData,
  validateCouponId,
  validateCouponRequest,
} = require("../middleware/coupon.middleware");

const router = express.Router();

// Create coupon
router.post(
  "/",
  validateCouponData,
  createCoupon
);

// Get all coupons
router.get(
  "/",
  getAllCoupons
);

// Validate coupon at checkout
router.post(
  "/validate",
  validateCouponRequest,
  validateCoupon
);

// Get one coupon
router.get(
  "/:id",
  validateCouponId,
  getCouponById
);

// Update coupon
router.put(
  "/:id",
  validateCouponId,
  validateCouponData,
  updateCoupon
);

// Delete coupon
router.delete(
  "/:id",
  validateCouponId,
  deleteCoupon
);

module.exports = router;
