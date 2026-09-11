
const crypto = require("crypto");

class OrderModel {
  constructor({
    id,
    orderNumber,
    items = [],
    customerName,
    customerPhone,
    orderType,
    deliveryAddress = "",
    paymentMethod = "cash",
    paymentStatus = "pending",
    status = "pending",
    notes = "",
    subtotal = 0,
    deliveryFee = 0,
    discount = 0,
    total = 0,
    createdAt,
    updatedAt,
  }) {
    this.id = id || crypto.randomUUID();

    this.orderNumber =
      orderNumber || this.generateOrderNumber();

    this.items = Array.isArray(items)
      ? items.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name || "",
          quantity: item.quantity,
          price:
            typeof item.price === "number"
              ? item.price
              : 0,
          total:
            typeof item.price === "number" &&
            typeof item.quantity === "number"
              ? item.price * item.quantity
              : 0,
        }))
      : [];

    this.customerName =
      typeof customerName === "string"
        ? customerName.trim()
        : "";

    this.customerPhone =
      typeof customerPhone === "string"
        ? customerPhone.trim()
        : "";

    this.orderType =
      typeof orderType === "string"
        ? orderType.trim().toLowerCase()
        : "pickup";

    this.deliveryAddress =
      typeof deliveryAddress === "string"
        ? deliveryAddress.trim()
        : "";

    this.paymentMethod =
      typeof paymentMethod === "string"
        ? paymentMethod.trim().toLowerCase()
        : "cash";

    this.paymentStatus =
      typeof paymentStatus === "string"
        ? paymentStatus.trim().toLowerCase()
        : "pending";

    this.status =
      typeof status === "string"
        ? status.trim().toLowerCase()
        : "pending";

    this.notes =
      typeof notes === "string"
        ? notes.trim()
        : "";

    this.subtotal =
      typeof subtotal === "number"
        ? subtotal
        : this.calculateSubtotal();

    this.deliveryFee =
      typeof deliveryFee === "number"
        ? deliveryFee
        : 0;

    this.discount =
      typeof discount === "number"
        ? discount
        : 0;

    this.total =
      typeof total === "number" && total > 0
        ? total
        : this.calculateTotal();

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase();

    return `ORD-${timestamp}-${random}`;
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => {
      const price =
        typeof item.price === "number"
          ? item.price
          : 0;

      const quantity =
        typeof item.quantity === "number"
          ? item.quantity
          : 0;

      return sum + price * quantity;
    }, 0);
  }

  calculateTotal() {
    const calculatedTotal =
      this.subtotal +
      this.deliveryFee -
      this.discount;

    return Math.max(0, calculatedTotal);
  }

  recalculateTotals() {
    this.subtotal = this.calculateSubtotal();
    this.total = this.calculateTotal();
    this.updatedAt = new Date().toISOString();

    return this;
  }

  update(data = {}) {
    const allowedFields = [
      "items",
      "customerName",
      "customerPhone",
      "orderType",
      "deliveryAddress",
      "paymentMethod",
      "notes",
      "deliveryFee",
      "discount",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });

    if (typeof data.customerName === "string") {
      this.customerName =
        data.customerName.trim();
    }

    if (typeof data.customerPhone === "string") {
      this.customerPhone =
        data.customerPhone.trim();
    }

    if (typeof data.orderType === "string") {
      this.orderType =
        data.orderType.trim().toLowerCase();
    }

    if (
      typeof data.deliveryAddress === "string"
    ) {
      this.deliveryAddress =
        data.deliveryAddress.trim();
    }

    if (
      typeof data.paymentMethod === "string"
    ) {
      this.paymentMethod =
        data.paymentMethod.trim().toLowerCase();
    }

    if (typeof data.notes === "string") {
      this.notes = data.notes.trim();
    }

    if (Array.isArray(data.items)) {
      this.items = data.items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name || "",
        quantity: item.quantity,
        price:
          typeof item.price === "number"
            ? item.price
            : 0,
        total:
          typeof item.price === "number" &&
          typeof item.quantity === "number"
            ? item.price * item.quantity
            : 0,
      }));
    }

    this.recalculateTotals();
    this.updatedAt = new Date().toISOString();

    return this;
  }

  updateStatus(status) {
    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid order status");
    }

    this.status = status;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  updatePaymentStatus(paymentStatus) {
    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      throw new Error("Invalid payment status");
    }

    this.paymentStatus = paymentStatus;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  cancel() {
    if (this.status === "completed") {
      throw new Error(
        "Completed order cannot be cancelled"
      );
    }

    if (this.status === "cancelled") {
      throw new Error(
        "Order is already cancelled"
      );
    }

    this.status = "cancelled";
    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      items: this.items,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      orderType: this.orderType,
      deliveryAddress: this.deliveryAddress,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      status: this.status,
      notes: this.notes,
      subtotal: this.subtotal,
      deliveryFee: this.deliveryFee,
      discount: this.discount,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = OrderModel;
