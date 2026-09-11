const couponService = require("../services/coupon.service");

// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get coupons",
    });
  }
};

// Get one coupon by ID
const getCouponById = async (req, res) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get coupon",
    });
  }
};

// Validate coupon code
const validateCoupon = async (req, res) => {
  try {
    const result = await couponService.validateCoupon(
      req.body.code,
      req.body.orderAmount
    );

    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Invalid coupon",
    });
  }
};

// Update coupon
const updateCoupon = async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update coupon",
    });
  }
};

// Delete coupon
const deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete coupon",
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
};
