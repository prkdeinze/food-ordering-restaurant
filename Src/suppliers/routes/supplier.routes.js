// Src/suppliers/routes/supplier.routes.js

const express = require("express");

const supplierController = require(
  "../controllers/supplier.controller"
);

const {
  validateSupplierId,
  validateCreateSupplier,
  validateUpdateSupplier,
} = require("../middleware/supplier.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Supplier Routes
|--------------------------------------------------------------------------
|
| Base URL will be:
| /api/suppliers
|
| These routes manage supplier accounts only.
| Supplier products, orders, payouts and returns will have
| their own modules/routes later.
|
|--------------------------------------------------------------------------
*/

// --------------------------------------------------
// CREATE SUPPLIER
// POST /api/suppliers
// --------------------------------------------------

router.post(
  "/",
  validateCreateSupplier,
  supplierController.createSupplier
);

// --------------------------------------------------
// GET ALL SUPPLIERS
// GET /api/suppliers
//
// Optional filters:
// ?status=active
// ?country=BE
// ?isActive=true
// ?isVerified=true
// ?search=company
// --------------------------------------------------

router.get(
  "/",
  supplierController.getAllSuppliers
);

// --------------------------------------------------
// GET ONE SUPPLIER
// GET /api/suppliers/:id
// --------------------------------------------------

router.get(
  "/:id",
  validateSupplierId,
  supplierController.getSupplierById
);

// --------------------------------------------------
// UPDATE SUPPLIER
// PUT /api/suppliers/:id
// --------------------------------------------------

router.put(
  "/:id",
  validateSupplierId,
  validateUpdateSupplier,
  supplierController.updateSupplier
);

// --------------------------------------------------
// ACTIVATE SUPPLIER
// PATCH /api/suppliers/:id/activate
// --------------------------------------------------

router.patch(
  "/:id/activate",
  validateSupplierId,
  supplierController.activateSupplier
);

// --------------------------------------------------
// SUSPEND SUPPLIER
// PATCH /api/suppliers/:id/suspend
// --------------------------------------------------

router.patch(
  "/:id/suspend",
  validateSupplierId,
  supplierController.suspendSupplier
);

// --------------------------------------------------
// VERIFY SUPPLIER
// PATCH /api/suppliers/:id/verify
// --------------------------------------------------

router.patch(
  "/:id/verify",
  validateSupplierId,
  supplierController.verifySupplier
);

// --------------------------------------------------
// DELETE SUPPLIER
// DELETE /api/suppliers/:id
// --------------------------------------------------

router.delete(
  "/:id",
  validateSupplierId,
  supplierController.deleteSupplier
);

module.exports = router;
