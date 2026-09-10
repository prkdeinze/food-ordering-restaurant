e || !name.trim()) {
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
    estimatedPickup
