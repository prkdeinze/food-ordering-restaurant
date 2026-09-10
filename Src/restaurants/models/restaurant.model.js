const restaurantModel = {
  name: "Restaurant",
  description: "Restaurant model",

  fields: {
    id: {
      type: "uuid",
      required: true,
      unique: true
    },

    ownerId: {
      type: "uuid",
      required: true
    },

    name: {
      type: "string",
      required: true,
      trim: true
    },

    slug: {
      type: "string",
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: "string",
      required: false
    },

    phone: {
      type: "string",
      required: true
    },

    email: {
      type: "string",
      required: false,
      lowercase: true,
      trim: true
    },

    website: {
      type: "string",
      required: false
    },

    logo: {
      type: "string",
      required: false
    },

    coverImage: {
      type: "string",
      required: false
    },

    cuisineTypes: {
      type: "array",
      required: false,
      default: []
    },

    address: {
      type: "object",
      required: true,
      fields: {
        street: {
          type: "string",
          required: true
        },

        houseNumber: {
          type: "string",
          required: true
        },

        postalCode: {
          type: "string",
          required: true
        },

        city: {
          type: "string",
          required: true
        },

        country: {
          type: "string",
          required: true,
          default: "Belgium"
        },

        latitude: {
          type: "number",
          required: false
        },

        longitude: {
          type: "number",
          required: false
        }
      }
    },

    openingHours: {
      type: "object",
      required: false,
      default: {}
    },

    deliveryEnabled: {
      type: "boolean",
      default: true
    },

    pickupEnabled: {
      type: "boolean",
      default: true
    },

    deliveryRadiusKm: {
      type: "number",
      required: false,
      default: 10
    },

    minimumOrderAmount: {
      type: "number",
      required: false,
      default: 0
    },

    deliveryFee: {
      type: "number",
      required: false,
      default: 0
    },

    freeDeliveryMinimum: {
      type: "number",
      required: false
    },

    estimatedDeliveryMinutes: {
      type: "number",
      required: false
    },

    estimatedPickupMinutes: {
      type: "number",
      required: false
    },

    currency: {
      type: "string",
      required: true,
      default: "EUR"
    },

    timezone: {
      type: "string",
      required: true,
      default: "Europe/Brussels"
    },

    taxNumber: {
      type: "string",
      required: false
    },

    acceptsCash: {
      type: "boolean",
      default: true
    },

    acceptsOnlinePayment: {
      type: "boolean",
      default: true
    },

    status: {
      type: "string",
      required: true,
      default: "pending",
      allowedValues: [
        "pending",
        "active",
        "inactive",
        "suspended"
      ]
    },

    isOpen: {
      type: "boolean",
      default: false
    },

    isVerified: {
      type: "boolean",
      default: false
    },

    rating: {
      type: "number",
      default: 0
    },

    totalReviews: {
      type: "number",
      default: 0
    },

    createdAt: {
      type: "date",
      required: true
    },

    updatedAt: {
      type: "date",
      required: true
    }
  }
};

module.exports = restaurantModel;
