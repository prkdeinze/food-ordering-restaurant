const validateCouponData = (req, res, next) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    startDate,
    endDate,
  } = req.body;

  const errors = [];

  if (!code || typeof code !== "string" || !code.trim()) {
    errors.push("Coupon code is required");
  }

  if (
    discountType &&
    !["percentage", "fixed"].includes(discountType)
  ) {
    errors.push(
      "Discount type must be percentage or fixed"
    );
  }

  if (
    discountValue !== undefined &&
    (typeof discountValue !== "number" ||
      discountValue <= 0)
  ) {
    errors.push(
      "Discount value must be greater than 0"
    );
  }

  if (
    discountType === "percentage" &&
    discountValue > 100
  ) {
    errors.push(
      "Percentage discount cannot be greater than 100"
    );
  }

  if (
    minOrderAmount !== undefined &&
    (typeof minOrderAmount !== "number" ||
      minOrderAmount < 0)
  ) {
    errors.push(
      "Minimum order amount cannot be negative"
    );
  }

  if (
    maxDiscountAmount !== undefined &&
    (typeof maxDiscountAmount !== "number" ||
      maxDiscountAmount < 0)
  ) {
    errors.push(
      "Maximum discount amount cannot be negative"
    );
  }

  if (
    startDate &&
    Number.isNaN(new Date(startDate).getTime())
  ) {
    errors.push("Start date is invalid");
  }

  if (
    endDate &&
    Number.isNaN(new Date(endDate).getTime())
  ) {
    errors.push("End date is invalid");
  }

  if (
    startDate &&
    endDate &&
    new Date(endDate) <= new Date(startDate)
  ) {
    errors.push(
      "End date must be after start date"
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon data",
      errors,
    });
  }

  if (code) {
    req.body.code = code.trim().toUpperCase();
  }

  next();
};

const validateCouponId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      success: false,
      message: "Valid coupon ID is required",
    });
  }

  next();
};

const validateCouponRequest = (req, res, next) => {
  const { code, orderAmount } = req.body;

  if (!code || typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Coupon code is required",
    });
  }

  if (
    orderAmount === undefined ||
    typeof orderAmount !== "number" ||
    orderAmount < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid order amount is required",
    });
  }

  req.body.code = code.trim().toUpperCase();

  next();
};

module.exports = {
  validateCouponData,
  validateCouponId,
  validateCouponRequest,
};
