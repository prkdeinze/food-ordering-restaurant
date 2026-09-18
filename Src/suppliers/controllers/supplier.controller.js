const supplierService = require("../services/supplier.service");

// --------------------------------------------------
// Create supplier
// --------------------------------------------------
const createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create supplier",
    });
  }
};

// --------------------------------------------------
// Get all suppliers
// --------------------------------------------------
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers({
      status: req.query.status,
      country: req.query.country,
      isActive: req.query.isActive,
      isVerified: req.query.isVerified,
      search: req.query.search,
    });

    return res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get suppliers",
    });
  }
};

// --------------------------------------------------
// Get supplier by ID
// --------------------------------------------------
const getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get supplier",
    });
  }
};

// --------------------------------------------------
// Update supplier
// --------------------------------------------------
const updateSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.updateSupplier(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update supplier",
    });
  }
};

// --------------------------------------------------
// Activate supplier
// --------------------------------------------------
const activateSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.activateSupplier(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Supplier activated successfully",
      data: supplier,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to activate supplier",
    });
  }
};

// --------------------------------------------------
// Suspend supplier
// --------------------------------------------------
const suspendSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.suspendSupplier(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Supplier suspended successfully",
      data: supplier,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to suspend supplier",
    });
  }
};

// --------------------------------------------------
// Verify supplier
// --------------------------------------------------
const verifySupplier = async (req, res) => {
  try {
    const supplier = await supplierService.verifySupplier(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Supplier verified successfully",
      data: supplier,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to verify supplier",
    });
  }
};

// --------------------------------------------------
// Delete supplier
// --------------------------------------------------
const deleteSupplier = async (req, res) => {
  try {
    await supplierService.deleteSupplier(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete supplier",
    });
  }
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
};
