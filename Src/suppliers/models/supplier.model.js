
const { randomUUID } = require("crypto");

/*
|--------------------------------------------------------------------------
| Supplier Model
|--------------------------------------------------------------------------
| Marketplace supplier structure.
|
| Business flow:
| Customer -> Our Platform -> Supplier -> Customer
|
| - Customer pays our platform
| - Supplier fulfils/delivers the order
| - Supplier is responsible for supplied goods
| - Supplier can handle returns/refunds according to agreed terms
| - Platform keeps its margin/commission
|
| Designed for:
| - Multiple suppliers
| - Multiple countries
| - Supplier products
| - Supplier payouts
| - Returns
| - Future supplier dashboard
|--------------------------------------------------------------------------
*/

class Supplier {
  constructor(data = {}) {
    const now = new Date().toISOString();

    // --------------------------------------------------
    // Core identity
    // --------------------------------------------------
    this.id = data.id || randomUUID();

    this.businessName = data.businessName || "";
    this.legalName = data.legalName || "";
    this.slug = data.slug || "";

    // --------------------------------------------------
    // Contact
    // --------------------------------------------------
    this.email = data.email || "";
    this.phone = data.phone || "";

    this.contactPerson = {
      name: data.contactPerson?.name || "",
      email: data.contactPerson?.email || "",
      phone: data.contactPerson?.phone || "",
    };

    // --------------------------------------------------
    // Business registration
    // --------------------------------------------------
    this.companyNumber = data.companyNumber || "";
    this.vatNumber = data.vatNumber || "";

    // --------------------------------------------------
    // Address
    // --------------------------------------------------
    this.address = {
      street: data.address?.street || "",
      houseNumber: data.address?.houseNumber || "",
      postalCode: data.address?.postalCode || "",
      city: data.address?.city || "",
      state: data.address?.state || "",
      country: data.address?.country || "",
      countryCode: data.address?.countryCode || "",
    };

    // --------------------------------------------------
    // Marketplace / supplier status
    // --------------------------------------------------
    this.status = data.status || "pending";
    // pending | active | suspended | rejected

    this.isActive =
      typeof data.isActive === "boolean"
        ? data.isActive
        : false;

    this.isVerified =
      typeof data.isVerified === "boolean"
        ? data.isVerified
        : false;

    // --------------------------------------------------
    // Commercial agreement
    // --------------------------------------------------
    this.commercial = {
      currency: data.commercial?.currency || "EUR",

      commissionType:
        data.commercial?.commissionType || "percentage",
      // percentage | fixed | custom

      commissionRate:
        Number(data.commercial?.commissionRate) || 0,

      fixedCommission:
        Number(data.commercial?.fixedCommission) || 0,

      minimumOrder:
        Number(data.commercial?.minimumOrder) || 0,
    };

    // --------------------------------------------------
    // Fulfilment
    // --------------------------------------------------
    this.fulfilment = {
      supplierShips:
        data.fulfilment?.supplierShips ?? true,

      processingTime:
        data.fulfilment?.processingTime || "",

      deliveryCountries:
        Array.isArray(data.fulfilment?.deliveryCountries)
          ? data.fulfilment.deliveryCountries
          : [],

      trackingSupported:
        data.fulfilment?.trackingSupported ?? false,
    };

    // --------------------------------------------------
    // Returns
    // --------------------------------------------------
    this.returns = {
      supplierResponsible:
        data.returns?.supplierResponsible ?? true,

      acceptsReturns:
        data.returns?.acceptsReturns ?? true,

      returnPeriodDays:
        Number(data.returns?.returnPeriodDays) || 0,

      returnAddress:
        data.returns?.returnAddress || null,

      policy:
        data.returns?.policy || "",
    };

    // --------------------------------------------------
    // Payout settings
    // IMPORTANT:
    // Never store card numbers or sensitive banking
    // credentials directly here.
    // --------------------------------------------------
    this.payout = {
      method: data.payout?.method || "",
      accountReference:
        data.payout?.accountReference || "",
      payoutSchedule:
        data.payout?.payoutSchedule || "manual",
      // manual | daily | weekly | monthly

      currency:
        data.payout?.currency || "EUR",
    };

    // --------------------------------------------------
    // Product / integration capability
    // --------------------------------------------------
    this.integration = {
      type: data.integration?.type || "manual",
      // manual | api | csv | feed

      externalSupplierId:
        data.integration?.externalSupplierId || "",

      inventorySync:
        data.integration?.inventorySync ?? false,

      priceSync:
        data.integration?.priceSync ?? false,

      orderSync:
        data.integration?.orderSync ?? false,
    };

    // --------------------------------------------------
    // Internal metadata
    // --------------------------------------------------
    this.notes = data.notes || "";

    this.createdAt = data.createdAt || now;
    this.updatedAt = data.updatedAt || now;
  }

  update(data = {}) {
    const protectedFields = [
      "id",
      "createdAt",
    ];

    Object.keys(data).forEach((key) => {
      if (!protectedFields.includes(key)) {
        this[key] = data[key];
      }
    });

    this.updatedAt = new Date().toISOString();

    return this;
  }

  activate() {
    this.status = "active";
    this.isActive = true;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  suspend() {
    this.status = "suspended";
    this.isActive = false;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  verify() {
    this.isVerified = true;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,

      businessName: this.businessName,
      legalName: this.legalName,
      slug: this.slug,

      email: this.email,
      phone: this.phone,

      contactPerson: this.contactPerson,

      companyNumber: this.companyNumber,
      vatNumber: this.vatNumber,

      address: this.address,

      status: this.status,
      isActive: this.isActive,
      isVerified: this.isVerified,

      commercial: this.commercial,
      fulfilment: this.fulfilment,
      returns: this.returns,
      payout: this.payout,
      integration: this.integration,

      notes: this.notes,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Supplier;
