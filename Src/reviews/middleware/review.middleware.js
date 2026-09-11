const validateReview = (req, res, next) => {
  const {
    userId,
    restaurantId,
    orderId,
    rating,
    comment,
  } = req.body;

  const errors = [];

  if (
    !userId ||
    typeof userId !== "string" ||
    !userId.trim()
  ) {
    errors.push("Valid user ID is required");
  }

  if (
    !restaurantId ||
    typeof restaurantId !== "string" ||
    !restaurantId.trim()
  ) {
    errors.push("Valid restaurant ID is required");
  }

  if (
    orderId !== undefined &&
    (
      typeof orderId !== "string" ||
      !orderId.trim()
    )
  ) {
    errors.push("Invalid order ID");
  }

  if (
    rating === undefined ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    errors.push("Rating must be an integer from 1 to 5");
  }

  if (
    comment !== undefined &&
    typeof comment !== "string"
  ) {
    errors.push("Comment must be text");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid review data",
      errors,
    });
  }

  req.body.userId = userId.trim();
  req.body.restaurantId = restaurantId.trim();

  if (typeof orderId === "string") {
    req.body.orderId = orderId.trim();
  }

  if (typeof comment === "string") {
    req.body.comment = comment.trim();
  }

  next();
};

const validateReviewId = (req, res, next) => {
  const { id } = req.params;

  if (
    !id ||
    typeof id !== "string" ||
    !id.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid review ID is required",
    });
  }

  next();
};

const validateRestaurantId = (
  req,
  res,
  next
) => {
  const { restaurantId } = req.params;

  if (
    !restaurantId ||
    typeof restaurantId !== "string" ||
    !restaurantId.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid restaurant ID is required",
    });
  }

  next();
};

const validateUserId = (req, res, next) => {
  const { userId } = req.params;

  if (
    !userId ||
    typeof userId !== "string" ||
    !userId.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid user ID is required",
    });
  }

  next();
};

module.exports = {
  validateReview,
  validateReviewId,
  validateRestaurantId,
  validateUserId,
};
