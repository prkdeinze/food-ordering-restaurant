const userModel = {
  name: "User",
  description: "User model",

  fields: {
    id: {
      type: "uuid",
      required: true,
      unique: true
    },

    name: {
      type: "string",
      required: true,
      trim: true
    },

    email: {
      type: "string",
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: "string",
      required: false,
      unique: true
    },

    passwordHash: {
      type: "string",
      required: true
    },

    role: {
      type: "string",
      required: true,
      default: "customer",
      allowedValues: [
        "customer",
        "restaurant_owner",
        "restaurant_staff",
        "driver",
        "admin",
        "super_admin"
      ]
    },

    status: {
      type: "string",
      required: true,
      default: "active",
      allowedValues: [
        "active",
        "inactive",
        "suspended"
      ]
    },

    emailVerified: {
      type: "boolean",
      default: false
    },

    phoneVerified: {
      type: "boolean",
      default: false
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

module.exports = userModel;
