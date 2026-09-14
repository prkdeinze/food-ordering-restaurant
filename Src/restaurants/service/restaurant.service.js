const crypto = require("crypto");
const db = require("../../../database/database");

const normalizeRestaurant = (row) => {
  if (!row) {
    return null;
  }

  return {
    ...row,
    cuisineTypes: row.cuisineTypes
      ? JSON.parse(row.cuisineTypes)
      : [],

    address: row.address
      ? JSON.parse(row.address)
      : {},

    openingHours: row.openingHours
      ? JSON.parse(row.openingHours)
      : {},

    deliveryEnabled: Boolean(row.deliveryEnabled),
    pickupEnabled: Boolean(row.pickupEnabled),
    acceptsCash: Boolean(row.acceptsCash),
    acceptsOnlinePayment: Boolean(row.acceptsOnlinePayment),
    isOpen: Boolean(row.isOpen),
    isVerified: Boolean(row.isVerified)
  };
};

const createRestaurant = async (restaurantData) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

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
      restaurantData.estimatedDeliveryMinutes !== undefined
        ? restaurantData.estimatedDeliveryMinutes
        : null,

    estimatedPickupMinutes:
      restaurantData.estimatedPickupMinutes !== undefined
        ? restaurantData.estimatedPickupMinutes
        : null,

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

    rating:
      restaurantData.rating !== undefined
        ? restaurantData.rating
        : 0,

    totalReviews:
      restaurantData.totalReviews !== undefined
        ? restaurantData.totalReviews
        : 0,

    createdAt: now,
    updatedAt: now
  };

  db.prepare(`
    INSERT INTO restaurants (
      id,
      ownerId,
      name,
      slug,
      description,
      phone,
      email,
      website,
      logo,
      coverImage,
      cuisineTypes,
      address,
      openingHours,
      deliveryEnabled,
      pickupEnabled,
      deliveryRadiusKm,
      minimumOrderAmount,
      deliveryFee,
      freeDeliveryMinimum,
      estimatedDeliveryMinutes,
      estimatedPickupMinutes,
      currency,
      timezone,
      taxNumber,
      acceptsCash,
      acceptsOnlinePayment,
      status,
      isOpen,
      isVerified,
      rating,
      totalReviews,
      createdAt,
      updatedAt
    )
    VALUES (
      @id,
      @ownerId,
      @name,
      @slug,
      @description,
      @phone,
      @email,
      @website,
      @logo,
      @coverImage,
      @cuisineTypes,
      @address,
      @openingHours,
      @deliveryEnabled,
      @pickupEnabled,
      @deliveryRadiusKm,
      @minimumOrderAmount,
      @deliveryFee,
      @freeDeliveryMinimum,
      @estimatedDeliveryMinutes,
      @estimatedPickupMinutes,
      @currency,
      @timezone,
      @taxNumber,
      @acceptsCash,
      @acceptsOnlinePayment,
      @status,
      @isOpen,
      @isVerified,
      @rating,
      @totalReviews,
      @createdAt,
      @updatedAt
    )
  `).run({
    id: restaurant.id,
    ownerId: restaurant.ownerId,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    phone: restaurant.phone,
    email: restaurant.email,
    website: restaurant.website,
    logo: restaurant.logo,
    coverImage: restaurant.coverImage,
    cuisineTypes: JSON.stringify(restaurant.cuisineTypes),
    address: JSON.stringify(restaurant.address),
    openingHours: JSON.stringify(restaurant.openingHours),
    deliveryEnabled: restaurant.deliveryEnabled ? 1 : 0,
    pickupEnabled: restaurant.pickupEnabled ? 1 : 0,
    deliveryRadiusKm: restaurant.deliveryRadiusKm,
    minimumOrderAmount: restaurant.minimumOrderAmount,
    deliveryFee: restaurant.deliveryFee,
    freeDeliveryMinimum: restaurant.freeDeliveryMinimum,
    estimatedDeliveryMinutes: restaurant.estimatedDeliveryMinutes,
    estimatedPickupMinutes: restaurant.estimatedPickupMinutes,
    currency: restaurant.currency,
    timezone: restaurant.timezone,
    taxNumber: restaurant.taxNumber,
    acceptsCash: restaurant.acceptsCash ? 1 : 0,
    acceptsOnlinePayment: restaurant.acceptsOnlinePayment ? 1 : 0,
    status: restaurant.status,
    isOpen: restaurant.isOpen ? 1 : 0,
    isVerified: restaurant.isVerified ? 1 : 0,
    rating: restaurant.rating,
    totalReviews: restaurant.totalReviews,
    createdAt: restaurant.createdAt,
    updatedAt: restaurant.updatedAt
  });

  return restaurant;
};

const getAllRestaurants = async () => {
  const rows = db
    .prepare("SELECT * FROM restaurants ORDER BY createdAt DESC")
    .all();

  return rows.map(normalizeRestaurant);
};

const getRestaurantById = async (id) => {
  const row = db
    .prepare("SELECT * FROM restaurants WHERE id = ?")
    .get(id);

  return normalizeRestaurant(row);
};

const getRestaurantBySlug = async (slug) => {
  if (!slug) {
    return null;
  }

  const normalizedSlug = slug.toLowerCase().trim();

  const row = db
    .prepare("SELECT * FROM restaurants WHERE slug = ?")
    .get(normalizedSlug);

  return normalizeRestaurant(row);
};

const getRestaurantsByOwnerId = async (ownerId) => {
  const rows = db
    .prepare(
      "SELECT * FROM restaurants WHERE ownerId = ? ORDER BY createdAt DESC"
    )
    .all(ownerId);

  return rows.map(normalizeRestaurant);
};

const updateRestaurant = async (id, updateData) => {
  const currentRestaurant = await getRestaurantById(id);

  if (!currentRestaurant) {
    return null;
  }

  const allowedFields = [
    "name",
    "slug",
    "description",
    "phone",
    "email",
    "website",
    "logo",
    "coverImage",
    "cuisineTypes",
    "address",
    "openingHours",
    "deliveryEnabled",
    "pickupEnabled",
    "deliveryRadiusKm",
    "minimumOrderAmount",
    "deliveryFee",
    "freeDeliveryMinimum",
    "estimatedDeliveryMinutes",
    "estimatedPickupMinutes",
    "currency",
    "timezone",
    "taxNumber",
    "acceptsCash",
    "acceptsOnlinePayment",
    "status",
    "isOpen",
    "isVerified",
    "rating",
    "totalReviews"
  ];

  const fields = [];
  const values = {};

  for (const field of allowedFields) {
    if (updateData[field] === undefined) {
      continue;
    }

    let value = updateData[field];

    if (field === "slug" && value) {
      value = value.toLowerCase().trim();
    }

    if (field === "email" && value) {
      value = value.toLowerCase().trim();
    }

    if (
      field === "cuisineTypes" ||
      field === "address" ||
      field === "openingHours"
    ) {
      value = JSON.stringify(value);
    }

    if (
      field === "deliveryEnabled" ||
      field === "pickupEnabled" ||
      field === "acceptsCash" ||
      field === "acceptsOnlinePayment" ||
      field === "isOpen" ||
      field === "isVerified"
    ) {
      value = value ? 1 : 0;
    }

    fields.push(`${field} = @${field}`);
    values[field] = value;
  }

  if (fields.length === 0) {
    return currentRestaurant;
  }

  values.id = id;
  values.updatedAt = new Date().toISOString();

  fields.push("updatedAt = @updatedAt");

  db.prepare(`
    UPDATE restaurants
    SET ${fields.join(", ")}
    WHERE id = @id
  `).run(values);

  return getRestaurantById(id);
};

const deleteRestaurant = async (id) => {
  const restaurant = await getRestaurantById(id);

  if (!restaurant) {
    return null;
  }

  db.prepare(
    "DELETE FROM restaurants WHERE id = ?"
  ).run(id);

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

  return updateRestaurant(id, {
    status
  });
};

const verifyRestaurant = async (id) => {
  return updateRestaurant(id, {
    isVerified: true,
    status: "active"
  });
};

const setRestaurantOpenStatus = async (id, isOpen) => {
  if (typeof isOpen !== "boolean") {
    throw new Error("isOpen must be boolean");
  }

  return updateRestaurant(id, {
    isOpen
  });
};

const updateOpeningHours = async (id, openingHours) => {
  return updateRestaurant(id, {
    openingHours
  });
};

const updateDeliverySettings = async (
  id,
  deliverySettings
) => {
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

const updateRestaurantAddress = async (
  id,
  address
) => {
  return updateRestaurant(id, {
    address
  });
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
  updateRestaurantImages
};
