// Src/suppliers/services/supplier.service.js

const crypto = require("crypto");
const Supplier = require("../models/supplier.model");

/*
|--------------------------------------------------------------------------
| Supplier Service
|--------------------------------------------------------------------------
| Business logic for suppliers.
|
| Designed for a multi-supplier marketplace where:
| - We do not need to own supplier stock.
| - Customers order through our platform.
| - Supplier fulfils/delivers the product.
| - Platform can keep its margin.
| - Supplier is responsible for its products and fulfilment.
|--------------------------------------------------------------------------
*/

const createId = () => {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return crypto.randomBytes(16).toString("hex");
};

const normalizeText = (value) => {
  if (typeof value !== "string") return value;
  return value.trim();
};

const normalizeEmail = (email) => {
  if (!email) return "";
  return String(email).trim().toLowerCase();
};

const normalizeCountry = (country) => {
  if (!country) return "";
  return String(country).trim().toUpperCase();
};

const normalizeStatus = (status) => {
  const allowedStatuses = [
    "pending",
    "active",
    "inactive",
    "suspended",
    "rejected",
  ];

  const normalized = String(status || "pending")
    .trim()
    .toLowerCase();

  if (!allowedStatuses.includes(normalized)) {
    const error = new Error(
      `Invalid supplier status. Allowed: ${allowedStatuses.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const validateSupplierData = (data = {}, isUpdate = false) => {
  if (!isUpdate && !normalizeText(data.name)) {
    const error = new Error("Supplier name is required");
    error.statusCode = 400;
    throw error;
  }

  if (data.email !== undefined && data.email !== "") {
    const email = normalizeEmail(data.email);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      const error = new Error("Invalid supplier email");
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.commissionRate !== undefined) {
    const commissionRate = Number(data.commissionRate);

    if (
      Number.isNaN(commissionRate) ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
      const error = new Error(
        "commissionRate must be a number between 0 and 100"
      );
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.paymentTermsDays !== undefined) {
    const paymentTermsDays = Number(data.paymentTermsDays);

    if (
      !Number.isInteger(paymentTermsDays) ||
      paymentTermsDays < 0
    ) {
      const error = new Error(
        "paymentTermsDays must be a non-negative integer"
      );
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.status !== undefined) {
    normalizeStatus(data.status);
  }
};

const prepareSupplierData = (data = {}, existing = {}) => {
  const supplier = {
    ...existing,
    ...data,
  };

  if (data.name !== undefined) {
    supplier.name = normalizeText(data.name);
  }

  if (data.companyName !== undefined) {
    supplier.companyName = normalizeText(data.companyName);
  }

  if (data.contactPerson !== undefined) {
    supplier.contactPerson = normalizeText(data.contactPerson);
  }

  if (data.email !== undefined) {
    supplier.email = normalizeEmail(data.email);
  }

  if (data.phone !== undefined) {
    supplier.phone = normalizeText(data.phone);
  }

  if (data.country !== undefined) {
    supplier.country = normalizeCountry(data.country);
  }

  if (data.status !== undefined) {
    supplier.status = normalizeStatus(data.status);
  }

  if (data.commissionRate !== undefined) {
    supplier.commissionRate = Number(data.commissionRate);
  }

  if (data.paymentTermsDays !== undefined) {
    supplier.paymentTermsDays = Number(data.paymentTermsDays);
  }

  if (data.isActive !== undefined) {
    supplier.isActive = Boolean(data.isActive);
  }

  return supplier;
};


/*
|--------------------------------------------------------------------------
| CREATE SUPPLIER
|--------------------------------------------------------------------------
*/

const createSupplier = async (supplierData) => {
  validateSupplierData(supplierData);

  const email = normalizeEmail(supplierData.email);

  if (email && typeof Supplier.findByEmail === "function") {
    const existingSupplier = await Supplier.findByEmail(email);

    if (existingSupplier) {
      const error = new Error(
        "A supplier with this email already exists"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  const now = new Date().toISOString();

  const supplier = prepareSupplierData(
    {
      id: createId(),

      name: supplierData.name,
      companyName: supplierData.companyName || "",
      contactPerson: supplierData.contactPerson || "",

      email,
      phone: supplierData.phone || "",

      vatNumber: supplierData.vatNumber || "",
      companyNumber: supplierData.companyNumber || "",

      address: supplierData.address || "",
      city: supplierData.city || "",
      postalCode: supplierData.postalCode || "",
      country: supplierData.country || "BE",

      website: supplierData.website || "",

      status: supplierData.status || "pending",
      isActive:
        supplierData.isActive !== undefined
          ? supplierData.isActive
          : true,

      // Platform commercial relationship
      commissionRate:
        supplierData.commissionRate !== undefined
          ? supplierData.commissionRate
          : 0,

      paymentTermsDays:
        supplierData.paymentTermsDays !== undefined
          ? supplierData.paymentTermsDays
          : 0,

      currency: supplierData.currency || "EUR",

      // Supplier fulfilment settings
      handlesDelivery:
        supplierData.handlesDelivery !== undefined
          ? Boolean(supplierData.handlesDelivery)
          : true,

      handlesReturns:
        supplierData.handlesReturns !== undefined
          ? Boolean(supplierData.handlesReturns)
          : true,

      notes: supplierData.notes || "",

      createdAt: now,
      updatedAt: now,
    },
    {}
  );

  if (typeof Supplier.create !== "function") {
    throw new Error(
      "Supplier model does not implement create()"
    );
  }

  return Supplier.create(supplier);
};


/*
|--------------------------------------------------------------------------
| GET ALL SUPPLIERS
|--------------------------------------------------------------------------
*/

const getAllSuppliers = async (filters = {}) => {
  if (typeof Supplier.findAll !== "function") {
    throw new Error(
      "Supplier model does not implement findAll()"
    );
  }

  const suppliers = await Supplier.findAll();

  let result = Array.isArray(suppliers) ? suppliers : [];

  if (filters.status) {
    const status = String(filters.status).toLowerCase();

    result = result.filter(
      (supplier) =>
        String(supplier.status || "").toLowerCase() === status
    );
  }

  if (filters.country) {
    const country = normalizeCountry(filters.country);

    result = result.filter(
      (supplier) =>
        normalizeCountry(supplier.country) === country
    );
  }

  if (filters.isActive !== undefined) {
    const active =
      filters.isActive === true ||
      filters.isActive === "true";

    result = result.filter(
      (supplier) => Boolean(supplier.isActive) === active
    );
  }

  if (filters.search) {
    const search = String(filters.search)
      .trim()
      .toLowerCase();

    result = result.filter((supplier) => {
      const searchable = [
        supplier.name,
        supplier.companyName,
        supplier.contactPerson,
        supplier.email,
        supplier.phone,
        supplier.city,
        supplier.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);
    });
  }

  return result;
};


/*
|--------------------------------------------------------------------------
| GET SUPPLIER BY ID
|--------------------------------------------------------------------------
*/

const getSupplierById = async (supplierId) => {
  if (!supplierId) {
    const error = new Error("Supplier ID is required");
    error.statusCode = 400;
    throw error;
  }

  if (typeof Supplier.findById !== "function") {
    throw new Error(
      "Supplier model does not implement findById()"
    );
  }

  const supplier = await Supplier.findById(supplierId);

  if (!supplier) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }

  return supplier;
};


/*
|--------------------------------------------------------------------------
| UPDATE SUPPLIER
|--------------------------------------------------------------------------
*/

const updateSupplier = async (supplierId, updateData) => {
  const existingSupplier = await getSupplierById(supplierId);

  validateSupplierData(updateData, true);

  if (
    updateData.email !== undefined &&
    normalizeEmail(updateData.email) !==
      normalizeEmail(existingSupplier.email) &&
    typeof Supplier.findByEmail === "function"
  ) {
    const supplierWithEmail = await Supplier.findByEmail(
      normalizeEmail(updateData.email)
    );

    if (
      supplierWithEmail &&
      supplierWithEmail.id !== supplierId
    ) {
      const error = new Error(
        "A supplier with this email already exists"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  const updatedSupplier = prepareSupplierData(
    {
      ...updateData,
      updatedAt: new Date().toISOString(),
    },
    existingSupplier
  );

  if (typeof Supplier.update !== "function") {
    throw new Error(
      "Supplier model does not implement update()"
    );
  }

  const result = await Supplier.update(
    supplierId,
    updatedSupplier
  );

  if (!result) {
    const error = new Error("Supplier could not be updated");
    error.statusCode = 500;
    throw error;
  }

  return result;
};


/*
|--------------------------------------------------------------------------
| CHANGE SUPPLIER STATUS
|--------------------------------------------------------------------------
*/

const updateSupplierStatus = async (
  supplierId,
  status
) => {
  const normalizedStatus = normalizeStatus(status);

  return updateSupplier(supplierId, {
    status: normalizedStatus,
  });
};


/*
|--------------------------------------------------------------------------
| ACTIVATE SUPPLIER
|--------------------------------------------------------------------------
*/

const activateSupplier = async (supplierId) => {
  return updateSupplier(supplierId, {
    isActive: true,
    status: "active",
  });
};


/*
|--------------------------------------------------------------------------
| DEACTIVATE SUPPLIER
|--------------------------------------------------------------------------
*/

const deactivateSupplier = async (supplierId) => {
  return updateSupplier(supplierId, {
    isActive: false,
    status: "inactive",
  });
};


/*
|--------------------------------------------------------------------------
| DELETE SUPPLIER
|--------------------------------------------------------------------------
*/

const deleteSupplier = async (supplierId) => {
  await getSupplierById(supplierId);

  if (typeof Supplier.remove !== "function") {
    throw new Error(
      "Supplier model does not implement remove()"
    );
  }

  const deleted = await Supplier.remove(supplierId);

  if (!deleted) {
    const error = new Error("Supplier could not be deleted");
    error.statusCode = 500;
    throw error;
  }

  return {
    success: true,
    supplierId,
  };
};


/*
|--------------------------------------------------------------------------
| SUPPLIER COMMERCIAL CALCULATION
|--------------------------------------------------------------------------
|
| This gives us a reusable calculation for later product/order logic.
|
| Example:
| Supplier price = €80
| Customer selling price = €100
| Platform margin = €20
|--------------------------------------------------------------------------
*/

const calculatePlatformMargin = (
  supplierPrice,
  sellingPrice
) => {
  const cost = Number(supplierPrice);
  const sale = Number(sellingPrice);

  if (
    Number.isNaN(cost) ||
    Number.isNaN(sale) ||
    cost < 0 ||
    sale < 0
  ) {
    const error = new Error(
      "Supplier price and selling price must be valid numbers"
    );
    error.statusCode = 400;
    throw error;
  }

  const margin = sale - cost;

  const marginPercentage =
    sale > 0
      ? Number(((margin / sale) * 100).toFixed(2))
      : 0;

  return {
    supplierPrice: cost,
    sellingPrice: sale,
    platformMargin: margin,
    marginPercentage,
  };
};


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  updateSupplierStatus,
  activateSupplier,
  deactivateSupplier,
  deleteSupplier,
  calculatePlatformMargin,
};
