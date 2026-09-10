const validateRestaurant = (req, res, next) => {
  const {
    ownerId,
    name,
    slug,
    phone,
    address
  } = req.body;

  if (!ownerId) {
    return res.status(400).json({
      success: false,
      message: "Owner ID is required"
    });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Restaurant name is required"
    });
  }

  if (!slug || !slug.trim()) {
    return res.status(400).json({
      success: false,
      message: "Restaurant slug is required"
    });
  }

  if (!phone || !phone.trim()) {
    return res.status(400).json({
      success: false,
      message: "Restaurant phone number is required"
    });
  }

  if (!address) {
    return res.status(400).json({
      success: false,
      message: "Restaurant address is required"
    });
  }

  const {
    street,
    houseNumber,
    postalCode,
    city
  } = address;

  if (!street || !houseNumber || !postalCode || !city) {
    return res.status(400).json({
      success: false,
      message:
        "Street, house number, postal code and city are required"
    });
  }

  next();
};

const validateRestaurantEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next();
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid restaurant email address"
    });
  }

  next();
};

const validateRestaurantId = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Restaurant ID is required"
    });
  }

  next();
};

const validateRestaurantStatus = (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "active",
    "inactive",
    "suspended"
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid restaurant status"
    });
  }

  next();
};

const validateDeliverySettings = (req, res, next) => {
  const {
    deliveryRadiusKm,
    minimumOrderAmount,
    deliveryFee,
    freeDeliveryMinimum,
    estimatedDeliveryMinutes,
    estimatedPickupMinutes
  } = req.body;

  const numericFields = {
    deliveryRadiusKm,
    minimumOrderAmount,
    deliveryFee,
    freeDeliveryMinimum,
    estimatedDeliveryMinutes,
    estimatedPickupMinutes
  };

  for (const [field, value] of Object.entries(numericFields)) {
    if (
      value !== undefined &&
      value !== null &&
      (typeof value !== "number" || value < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: `${field} must be a positive number`
      });
    }
  }

  next();
};

const validateCoordinates = (req, res, next) => {
  const { address } = req.body;

  if (!address) {
    return next();
  }

  const { latitude, longitude } = address;

  if (
    latitude !== undefined &&
    (typeof latitude !== "number" ||
      latitude < -90 ||
      latitude > 90)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude"
    });
  }

  if (
    longitude !== undefined &&
    (typeof longitude !== "number" ||
      longitude < -180 ||
      longitude > 180)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid longitude"
    });
  }

  next();
};

const validateRating = (req, res, next) => {
  const { rating } = req.body;

  if (
    rating !== undefined &&
    (typeof rating !== "number" ||
      rating < 0 ||
      rating > 5)
  ) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 0 and 5"
    });
  }

  next();
};

module.exports = {
  validateRestaurant,
  validateRestaurantEmail,
  validateRestaurantId,
  validateRestaurantStatus,
  validateDeliverySettings,
  validateCoordinates,
  validateRating
};
