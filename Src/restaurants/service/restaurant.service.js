const crypto = require("crypto");

const restaurants = new Map();

const createRestaurant = async (restaurantData) => {
  const id = crypto.randomUUID();

  const restaurant = {
    id,
    ownerId: restaurantData.ownerId,
    name: restaurantData.name,
    slug: restaurantData.slug.toLowerCase().trim(),
    description: restaurantData.description || "",
    phone: restaurantData.phone,
    email: restaurantData.email
      ? restaurantData.email.toLowerCase().trim()
      : null,
    website: restaurantData.website || null,
    logo: restaurantData.logo || null,
    coverImage: restaurantData.coverImage || null,
    cuisineTypes: restaurantData.cuisineTypes || [],
    address: restaurantData.address,
    openingHours: restaurantData.openingHours || {},
    deliveryEnabled:
      restaurantData.deliveryEnabled !== undefined
        ? restaurantData.deliveryEnabled
        : true,
    pickupEnabled:
      restaurantData.pickupEnabled !== undefined
        ? restaurantData.pickupEnabled
        : true,
    deliveryRadiusKm:
      restaurantData.deliveryRadiusKm !== undefined
        ? restaurantData.deliveryRadiusKm
        : 10,
    minimumOrderAmount:
      restaurantData.minimumOrderAmount !== undefined
        ? restaurantData.minimumOrderAmount
        : 0,
    deliveryFee:
      restaurantData.deliveryFee !== undefined
        ? restaurantData.deliveryFee
        : 0,
    freeDeliveryMinimum:
      restaurantData.freeDeliveryMinimum !== undefined
        ? restaurantData.freeDeliveryMinimum
        : null,
    estimatedDeliveryMinutes:
      restaurantData.estimatedDeliveryMinutes || null,
    estimatedPickupMinutes:
      restaurantData.estimatedPickupMinutes || null,
    currency: restaurantData.currency || "EUR",
    timezone: restaurantData.timezone || "Europe/Brussels",
    taxNumber: restaurantData.taxNumber || null,
    acceptsCash:
      restaurantData.acceptsCash !== undefined
        ? restaurantData.acceptsCash
        : true,
    acceptsOnlinePayment:
      restaurantData.acceptsOnlinePayment !== undefined
        ? restaurantData.acceptsOnlinePayment
        : true,
    status: restaurantData.status || "pending",
    isOpen:
      restaurantData.isOpen !== undefined
        ? restaurantData.isOpen
        : false,
    isVerified:
      restaurantData.isVerified !== undefined
        ? restaurantData.isVerified
        : false,
    rating: restaurantData.rating || 0,
    totalReviews: restaurantData.totalReviews || 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  restaurants.set(id, restaurant);

  return restaurant;
};

const getAllRestaurants = async () => {
  return Array.from(restaurants.values());
};

const getRestaurantById = async (id) => {
  return restaurants.get(id) || null;
};

const getRestaurantBySlug = async (slug) => {
  if (!slug) {
    return null;
  }

  const normalizedSlug = slug.toLowerCase().trim();

  return (
    Array.from(restaurants.values()).find(
      (restaurant) => restaurant.slug === normalizedSlug
    ) || null
  );
};

const getRestaurantsByOwnerId = async (ownerId) => {
  return Array.from(restaurants.values()).filter(
    (restaurant) => restaurant.ownerId === ownerId
  );
};

const updateRestaurant = async (id, updateData) => {
  const restaurant = restaurants.get(id);

  if (!restaurant) {
    return null;
  }

  const updatedRestaurant = {
    ...restaurant,
    ...updateData,
    id: restaurant.id,
    ownerId: restaurant.ownerId,
    createdAt: restaurant.createdAt,
    updatedAt: new Date()
  };

  if (updatedRestaurant.slug) {
    updatedRestaurant.slug = updatedRestaurant.slug
      .toLowerCase()
      .trim();
  }

  if (updatedRestaurant.email) {
    updatedRestaurant.email = updatedRestaurant.email
      .toLowerCase()
      .trim();
  }

  restaurants.set(id, updatedRestaurant);

  return updatedRestaurant;
};

const deleteRestaurant = async (id) => {
  const restaurant = restaurants.get(id);

  if (!restaurant) {
    return null;
  }

  restaurants.delete(id);

  return restaurant;
};

const changeRestaurantStatus = async (id, status) => {
  const allowedStatuses = [
    "pending",
    "active",
    "inactive",
    "suspended"
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid restaurant status");
  }

  return updateRestaurant(id, { status });
};

const verifyRestaurant = async (id) => {
  return updateRestaurant(id, {
    isVerified: true,
    status: "active"
  });
};

const setRestaurantOpenStatus = async (id, isOpen) => {
  if (typeof isOpen !== "boolean") {
    throw new Error("isOpen must be true or false");
  }

  return updateRestaurant(id, { isOpen });
};

const updateOpeningHours = async (id, openingHours) => {
  return updateRestaurant(id, { openingHours });
};

const updateDeliverySettings = async (id, deliverySettings) => {
  const allowedFields = [
    "deliveryEnabled",
    "pickupEnabled",
    "deliveryRadiusKm",
    "minimumOrderAmount",
    "deliveryFee",
    "freeDeliveryMinimum",
    "estimatedDeliveryMinutes",
    "estimatedPickupMinutes"
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (deliverySettings[field] !== undefined) {
      updates[field] = deliverySettings[field];
    }
  });

  return updateRestaurant(id, updates);
};

const updateRestaurantAddress = async (id, address) => {
  return updateRestaurant(id, { address });
};

const updateRestaurantImages = async (
  id,
  logo,
  coverImage
) => {
  const updates = {};

  if (logo !== undefined) {
    updates.logo = logo;
  }

  if (coverImage !== undefined) {
    updates.coverImage = coverImage;
  }

  return updateRestaurant(id, updates);
};

const updateRestaurantRating = async (
  id,
  rating,
  totalReviews
) => {
  if (
    typeof rating !== "number" ||
    rating < 0 ||
    rating > 5
  ) {
    throw new Error("Rating must be between 0 and 5");
  }

  return updateRestaurant(id, {
    rating,
    totalReviews:
      totalReviews !== undefined ? totalReviews : 0
  });
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantBySlug,
  getRestaurantsByOwnerId,
  updateRestaurant,
  deleteRestaurant,
  changeRestaurantStatus,
  verifyRestaurant,
  setRestaurantOpenStatus,
  updateOpeningHours,
  updateDeliverySettings,
  updateRestaurantAddress,
  updateRestaurantImages,
  updateRestaurantRating
};
