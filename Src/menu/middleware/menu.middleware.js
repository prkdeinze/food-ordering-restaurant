
const validateMenuItem = (req, res, next) => {
  const {
    name,
    description,
    price,
    category,
    image,
    isAvailable,
  } = req.body;

  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Menu item name is required");
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    errors.push("Description must be text");
  }

  if (
    price === undefined ||
    typeof price !== "number" ||
    price < 0
  ) {
    errors.push("Valid menu item price is required");
  }

  if (
    category !== undefined &&
    (typeof category !== "string" || !category.trim())
  ) {
    errors.push("Category must be valid");
  }

  if (
    image !== undefined &&
    typeof image !== "string"
  ) {
    errors.push("Image must be a valid URL or path");
  }

  if (
    isAvailable !== undefined &&
    typeof isAvailable !== "boolean"
  ) {
    errors.push("Availability must be true or false");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid menu item data",
      errors,
    });
  }

  req.body.name = name.trim();

  if (typeof description === "string") {
    req.body.description = description.trim();
  }

  if (typeof category === "string") {
    req.body.category = category.trim();
  }

  next();
};

const validateMenuItemId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      success: false,
      message: "Valid menu item ID is required",
    });
  }

  next();
};

const validateAvailabilityUpdate = (req, res, next) => {
  const { isAvailable } = req.body;

  if (typeof isAvailable !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isAvailable must be true or false",
    });
  }

  next();
};

module.exports = {
  validateMenuItem,
  validateMenuItemId,
  validateAvailabilityUpdate,
};
