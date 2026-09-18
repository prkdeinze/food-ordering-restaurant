const Supplier = require("../models/supplier.model");

// Temporary in-memory storage.
// Later this storage layer can be replaced with SQLite/database
// without changing the controller/routes API.
const suppliers = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeEmail = (email = "") =>
  String(email).trim().toLowerCase();

const normalizeSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const findSupplierInstance = (id) => {
  const supplier = suppliers.get(id);

  if (!supplier) {
    throw createError("Supplier not found", 404);
  }

  return supplier;
};

const ensureUniqueEmail = (email, excludeId = null) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  for (const supplier of suppliers.values()) {
    if (
      supplier.id !== excludeId &&
      normalizeEmail(supplier.email) === normalizedEmail
    ) {
      throw createError(
        "A supplier with this email already exists",
        409
      );
    }
  }
};

const ensureUniqueSlug = (slug, excludeId = null) => {
  if (!slug) {
    return;
  }

  for (const supplier of suppliers.values()) {
    if (
      supplier.id !== excludeId &&
      supplier.slug === slug
    ) {
      throw createError(
        "A supplier with this slug already exists",
        409
      );
    }
  }
};

// --------------------------------------------------
// Create supplier
// --------------------------------------------------
const createSupplier = async (data = {}) => {
  if (
    typeof data.businessName !== "string" ||
    !data.businessName.trim()
  ) {
    throw createError(
      "Supplier business name is required",
      400
    );
  }

  ensureUniqueEmail(data.email);

  const slug =
    normalizeSlug(data.slug) ||
    normalizeSlug(data.businessName);

  ensureUniqueSlug(slug);

  const supplier = new Supplier({
    ...data,
    businessName: data.businessName.trim(),
    email: normalizeEmail(data.email),
    slug,
  });

  suppliers.set(supplier.id, supplier);

  return supplier.toJSON();
};

// --------------------------------------------------
// Get all suppliers
// --------------------------------------------------
const getAllSuppliers = async (filters = {}) => {
  let result = Array.from(suppliers.values());

  if (filters.status) {
    const status = String(filters.status)
      .trim()
      .toLowerCase();

    result = result.filter(
      (supplier) => supplier.status === status
    );
  }

  if (filters.country) {
    const country = String(filters.country)
      .trim()
      .toLowerCase();

    result = result.filter(
      (supplier) =>
        String(supplier.address?.country || "")
          .trim()
          .toLowerCase() === country ||
        String(supplier.address?.countryCode || "")
          .trim()
          .toLowerCase() === country
    );
  }

  if (filters.isActive !== undefined) {
    const isActive =
      filters.isActive === true ||
      filters.isActive === "true";

    result = result.filter(
      (supplier) => supplier.isActive === isActive
    );
  }

  if (filters.isVerified !== undefined) {
    const isVerified =
      filters.isVerified === true ||
      filters.isVerified === "true";

    result = result.filter(
      (supplier) =>
        supplier.isVerified === isVerified
    );
  }

  if (filters.search) {
    const search = String(filters.search)
      .trim()
      .toLowerCase();

    result = result.filter((supplier) => {
      const searchable = [
        supplier.businessName,
        supplier.legalName,
        supplier.email,
        supplier.phone,
        supplier.contactPerson?.name,
        supplier.address?.city,
        supplier.address?.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);
    });
  }

  return result
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .map((supplier) => supplier.toJSON());
};

// --------------------------------------------------
// Get supplier by ID
// --------------------------------------------------
const getSupplierById = async (id) => {
  return findSupplierInstance(id).toJSON();
};

// --------------------------------------------------
// Update supplier
// --------------------------------------------------
const updateSupplier = async (id, data = {}) => {
  const supplier = findSupplierInstance(id);

  if (
    data.businessName !== undefined &&
    (
      typeof data.businessName !== "string" ||
      !data.businessName.trim()
    )
  ) {
    throw createError(
      "Supplier business name cannot be empty",
      400
    );
  }

  if (data.email !== undefined) {
    ensureUniqueEmail(data.email, id);
    data.email = normalizeEmail(data.email);
  }

  if (data.slug !== undefined) {
    const slug = normalizeSlug(data.slug);

    if (!slug) {
      throw createError(
        "Supplier slug cannot be empty",
        400
      );
    }

    ensureUniqueSlug(slug, id);
    data.slug = slug;
  }

  if (typeof data.businessName === "string") {
    data.businessName = data.businessName.trim();
  }

  supplier.update(data);

  suppliers.set(supplier.id, supplier);

  return supplier.toJSON();
};

// --------------------------------------------------
// Activate supplier
// --------------------------------------------------
const activateSupplier = async (id) => {
  const supplier = findSupplierInstance(id);

  supplier.activate();

  suppliers.set(supplier.id, supplier);

  return supplier.toJSON();
};

// --------------------------------------------------
// Suspend supplier
// --------------------------------------------------
const suspendSupplier = async (id) => {
  const supplier = findSupplierInstance(id);

  supplier.suspend();

  suppliers.set(supplier.id, supplier);

  return supplier.toJSON();
};

// --------------------------------------------------
// Verify supplier
// --------------------------------------------------
const verifySupplier = async (id) => {
  const supplier = findSupplierInstance(id);

  supplier.verify();

  suppliers.set(supplier.id, supplier);

  return supplier.toJSON();
};

// --------------------------------------------------
// Delete supplier
// --------------------------------------------------
const deleteSupplier = async (id) => {
  findSupplierInstance(id);

  suppliers.delete(id);

  return true;
};

// --------------------------------------------------
// Platform margin calculation
// --------------------------------------------------
const calculatePlatformMargin = (
  supplierPrice,
  sellingPrice
) => {
  const cost = Number(supplierPrice);
  const sale = Number(sellingPrice);

  if (
    !Number.isFinite(cost) ||
    !Number.isFinite(sale) ||
    cost < 0 ||
    sale < 0
  ) {
    throw createError(
      "Supplier price and selling price must be valid numbers",
      400
    );
  }

  const platformMargin = sale - cost;

  const marginPercentage =
    sale > 0
      ? Number(
          ((platformMargin / sale) * 100).toFixed(2)
        )
      : 0;

  return {
    supplierPrice: cost,
    sellingPrice: sale,
    platformMargin,
    marginPercentage,
  };
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  activateSupplier,
  suspendSupplier,
  verifySupplier,
  deleteSupplier,
  calculatePlatformMargin,
};
