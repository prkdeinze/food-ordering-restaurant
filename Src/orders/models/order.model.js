const crypto = require("crypto");

class OrderModel {
  constructor({
    id,
    restaurantId,
    orderNumber,
    items = [],
    customerName,
    customerPhone,
    customerEmail = "",
    orderType = "pickup",
    deliveryAddress = "",
    paymentMethod = "cash",
    paymentStatus = "pending",
    status = "pending",
    notes = "",
    deliveryFee = 0,
    discount = 0,
    createdAt,
    updatedAt,
  } = {}) {
    this.id = id || crypto.randomUUID();

    this.restaurantId =
      typeof restaurantId === "string"
        ? restaurantId.trim()
        : "";

    this.orderNumber =
      orderNumber || this.generateOrderNumber();

    this.items = this.normalizeItems(items);

    this.customerName =
      typeof customerName === "string"
        ? customerName.trim()
        : "";

    this.customerPhone =
      typeof customerPhone === "string"
        ? customerPhone.trim()
        : "";

    this.customerEmail =
      typeof customerEmail === "string"
        ? customerEmail.trim().toLowerCase()
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

    this.deliveryFee =
      this.toValidNumber(deliveryFee);

    this.discount =
      this.toValidNumber(discount);

    // Always calculate prices on the server
    this.subtotal = this.calculateSubtotal();
    this.total = this.calculateTotal();

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  toValidNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
      return 0;
    }

    return number;
  }

  normalizeItems(items) {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item = {}) => {
      const quantity =
        this.toValidNumber(item.quantity);

      const price =
        this.toValidNumber(item.price);

      return {
        menuItemId: item.menuItemId || "",
        name:
          typeof item.name === "string"
            ? item.name.trim()
            : "",
        quantity,
        price,
        total: price * quantity,
      };
    });
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
    return this.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }

  calculateTotal() {
    return Math.max(
      0,
      this.subtotal +
        this.deliveryFee -
        this.discount
    );
  }

  recalculateTotals() {
    this.subtotal = this.calculateSubtotal();
    this.total = this.calculateTotal();
    this.updatedAt = new Date().toISOString();

    return this;
  }

  update(data = {}) {
    if (Array.isArray(data.items)) {
      this.items =
        this.normalizeItems(data.items);
    }

    // restaurantId is deliberately NOT editable here.
    // An order must remain attached to its restaurant.

    if (typeof data.customerName === "string") {
      this.customerName =
        data.customerName.trim();
    }

    if (typeof data.customerPhone === "string") {
      this.customerPhone =
        data.customerPhone.trim();
    }

    if (typeof data.customerEmail === "string") {
      this.customerEmail =
        data.customerEmail.trim().toLowerCase();
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

    if (data.deliveryFee !== undefined) {
      this.deliveryFee =
        this.toValidNumber(data.deliveryFee);
    }

    if (data.discount !== undefined) {
      this.discount =
        this.toValidNumber(data.discount);
    }

    this.recalculateTotals();

    return this;
  }

  updateStatus(status) {
    const normalizedStatus =
      typeof status === "string"
        ? status.trim().toLowerCase()
        : "";

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
      "cancelled",
    ];

    if (
      !allowedStatuses.includes(
        normalizedStatus
      )
    ) {
      throw new Error("Invalid order status");
    }

    this.status = normalizedStatus;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  updatePaymentStatus(paymentStatus) {
    const normalizedStatus =
      typeof paymentStatus === "string"
        ? paymentStatus.trim().toLowerCase()
        : "";

    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (
      !allowedPaymentStatuses.includes(
        normalizedStatus
      )
    ) {
      throw new Error(
        "Invalid payment status"
      );
    }

    this.paymentStatus = normalizedStatus;
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
      restaurantId: this.restaurantId,
      orderNumber: this.orderNumber,
      items: this.items,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail,
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
