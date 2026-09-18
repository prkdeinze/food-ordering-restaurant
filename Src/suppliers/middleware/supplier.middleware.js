// Src/suppliers/middleware/supplier.middleware.js

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const sendValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

const isPlainObject = (value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

const isValidEmail = (email) => {
  if (typeof email !== "string") return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
};

const allowedStatuses = [
  "pending",
  "active",
  "suspended",
  "rejected",
];

const allowedCommissionTypes = [
  "percentage",
  "fixed",
  "custom",
];

const allowedPayoutSchedules = [
  "manual",
  "daily",
  "weekly",
  "monthly",
];

const allowedIntegrationTypes = [
  "manual",
  "api",
  "csv",
  "feed",
];

// --------------------------------------------------
// Validate supplier ID
// --------------------------------------------------

const validateSupplierId = (req, res, next) => {
  const { id } = req.params;

  if (
    !id ||
    typeof id !== "string" ||
    !id.trim()
  ) {
    return sendValidationError(
      res,
      "Valid supplier ID is required"
    );
  }

  req.params.id = id.trim();

  return next();
};

// --------------------------------------------------
// Validate create supplier
// --------------------------------------------------

const validateCreateSupplier = (req, res, next) => {
  const data = req.body || {};

  if (
    typeof data.businessName !== "string" ||
    !data.businessName.trim()
  ) {
    return sendValidationError(
      res,
      "Supplier business name is required"
    );
  }

  if (
    data.email !== undefined &&
    data.email !== "" &&
    !isValidEmail(data.email)
  ) {
    return sendValidationError(
      res,
      "Invalid supplier email"
    );
  }

  return validateSupplierFields(req, res, next);
};

// --------------------------------------------------
// Validate update supplier
// --------------------------------------------------

const validateUpdateSupplier = (req, res, next) => {
  const data = req.body || {};

  if (Object.keys(data).length === 0) {
    return sendValidationError(
      res,
      "At least one supplier field is required"
    );
  }

  if (
    data.businessName !== undefined &&
    (
      typeof data.businessName !== "string" ||
      !data.businessName.trim()
    )
  ) {
    return sendValidationError(
      res,
      "Supplier business name cannot be empty"
    );
  }

  if (
    data.email !== undefined &&
    data.email !== "" &&
    !isValidEmail(data.email)
  ) {
    return sendValidationError(
      res,
      "Invalid supplier email"
    );
  }

  return validateSupplierFields(req, res, next);
};

// --------------------------------------------------
// Validate shared supplier fields
// --------------------------------------------------

function validateSupplierFields(req, res, next) {
  const data = req.body || {};

  if (
    data.status !== undefined &&
    !allowedStatuses.includes(data.status)
  ) {
    return sendValidationError(
      res,
      `Invalid supplier status. Allowed: ${allowedStatuses.join(
        ", "
      )}`
    );
  }

  if (
    data.isActive !== undefined &&
    typeof data.isActive !== "boolean"
  ) {
    return sendValidationError(
      res,
      "isActive must be true or false"
    );
  }

  if (
    data.isVerified !== undefined &&
    typeof data.isVerified !== "boolean"
  ) {
    return sendValidationError(
      res,
      "isVerified must be true or false"
    );
  }

  // --------------------------------------------------
  // Contact person
  // --------------------------------------------------

  if (
    data.contactPerson !== undefined &&
    !isPlainObject(data.contactPerson)
  ) {
    return sendValidationError(
      res,
      "contactPerson must be an object"
    );
  }

  if (
    data.contactPerson?.email &&
    !isValidEmail(data.contactPerson.email)
  ) {
    return sendValidationError(
      res,
      "Invalid contact person email"
    );
  }

  // --------------------------------------------------
  // Address
  // --------------------------------------------------

  if (
    data.address !== undefined &&
    !isPlainObject(data.address)
  ) {
    return sendValidationError(
      res,
      "address must be an object"
    );
  }

  // --------------------------------------------------
  // Commercial settings
  // --------------------------------------------------

  if (
    data.commercial !== undefined &&
    !isPlainObject(data.commercial)
  ) {
    return sendValidationError(
      res,
      "commercial must be an object"
    );
  }

  if (
    data.commercial?.commissionType !== undefined &&
    !allowedCommissionTypes.includes(
      data.commercial.commissionType
    )
  ) {
    return sendValidationError(
      res,
      `Invalid commission type. Allowed: ${allowedCommissionTypes.join(
        ", "
      )}`
    );
  }

  if (
    data.commercial?.commissionRate !== undefined
  ) {
    const rate = Number(
      data.commercial.commissionRate
    );

    if (
      !Number.isFinite(rate) ||
      rate < 0 ||
      rate > 100
    ) {
      return sendValidationError(
        res,
        "Commission rate must be between 0 and 100"
      );
    }
  }

  if (
    data.commercial?.fixedCommission !== undefined
  ) {
    const amount = Number(
      data.commercial.fixedCommission
    );

    if (!Number.isFinite(amount) || amount < 0) {
      return sendValidationError(
        res,
        "Fixed commission cannot be negative"
      );
    }
  }

  if (
    data.commercial?.minimumOrder !== undefined
  ) {
    const amount = Number(
      data.commercial.minimumOrder
    );

    if (!Number.isFinite(amount) || amount < 0) {
      return sendValidationError(
        res,
        "Minimum order cannot be negative"
      );
    }
  }

  // --------------------------------------------------
  // Fulfilment settings
  // --------------------------------------------------

  if (
    data.fulfilment !== undefined &&
    !isPlainObject(data.fulfilment)
  ) {
    return sendValidationError(
      res,
      "fulfilment must be an object"
    );
  }

  if (
    data.fulfilment?.deliveryCountries !==
      undefined &&
    !Array.isArray(
      data.fulfilment.deliveryCountries
    )
  ) {
    return sendValidationError(
      res,
      "deliveryCountries must be an array"
    );
  }

  // --------------------------------------------------
  // Return settings
  // --------------------------------------------------

  if (
    data.returns !== undefined &&
    !isPlainObject(data.returns)
  ) {
    return sendValidationError(
      res,
      "returns must be an object"
    );
  }

  if (
    data.returns?.returnPeriodDays !== undefined
  ) {
    const days = Number(
      data.returns.returnPeriodDays
    );

    if (
      !Number.isInteger(days) ||
      days < 0
    ) {
      return sendValidationError(
        res,
        "Return period must be a non-negative integer"
      );
    }
  }

  // --------------------------------------------------
  // Payout settings
  // --------------------------------------------------

  if (
    data.payout !== undefined &&
    !isPlainObject(data.payout)
  ) {
    return sendValidationError(
      res,
      "payout must be an object"
    );
  }

  if (
    data.payout?.payoutSchedule !== undefined &&
    !allowedPayoutSchedules.includes(
      data.payout.payoutSchedule
    )
  ) {
    return sendValidationError(
      res,
      `Invalid payout schedule. Allowed: ${allowedPayoutSchedules.join(
        ", "
      )}`
    );
  }

  // --------------------------------------------------
  // Integration settings
  // --------------------------------------------------

  if (
    data.integration !== undefined &&
    !isPlainObject(data.integration)
  ) {
    return sendValidationError(
      res,
      "integration must be an object"
    );
  }

  if (
    data.integration?.type !== undefined &&
    !allowedIntegrationTypes.includes(
      data.integration.type
    )
  ) {
    return sendValidationError(
      res,
      `Invalid integration type. Allowed: ${allowedIntegrationTypes.join(
        ", "
      )}`
    );
  }

  return next();
}

// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  validateSupplierId,
  validateCreateSupplier,
  validateUpdateSupplier,
};
