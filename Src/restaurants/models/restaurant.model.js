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
      type: "
