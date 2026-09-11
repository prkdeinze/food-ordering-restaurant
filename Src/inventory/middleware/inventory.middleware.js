
const validateInventoryItem = (req, res, next) => {
  const {
    name,
    quantity,
    unit,
    minimumStock,
    price,
  } = req.body;

  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Inventory item name is required");
  }

  if (
    quantity !== undefined &&
    (typeof quantity !== "number" || quantity < 0)
  ) {
    errors.push("Quantity must be a valid non-negative number");
  }

  if (
    minimumStock !== undefined &&
    (typeof minimumStock !== "number" || minimumStock < 0)
  ) {
    errors.push("Minimum stock must be a valid non-negative number");
  }

  if (
    price !== undefined &&
    (typeof price !== "number" || price < 0)
  ) {
    errors.push("Price must be a valid non-negative number");
  }

  if (
    unit !== undefined &&
    (typeof unit !== "string" || !unit.trim())
  ) {
    errors.push("Unit must be a valid value");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid inventory data",
      errors,
    });
  }

  if (name) {
    req.body.name = name.trim();
  }

  if (unit) {
    req.body.unit = unit.trim().toLowerCase();
  }

  next();
};

const validateInventoryId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !id.trim()) {
    return res.status(400).json({
      success: false,
      message: "Valid inventory item ID is required",
    });
  }

  next();
};

const validateStockUpdate = (req, res, next) => {
  const { quantity } = req.body;

  if (
    quantity === undefined ||
    typeof quantity !== "number" ||
    quantity < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid stock quantity is required",
    });
  }

  next();
};

module.exports = {
  validateInventoryItem,
  validateInventoryId,
  validateStockUpdate,
};
