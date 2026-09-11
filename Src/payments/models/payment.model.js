const crypto = require("crypto");

class PaymentModel {
  constructor({
    id,
    orderId,
    amount,
    currency = "EUR",
    paymentMethod,
    status = "pending",
    transactionId = null,
    failureReason = "",
    refundAmount = 0,
    refundReason = "",
    paidAt = null,
    refundedAt = null,
    createdAt,
    updatedAt,
  }) {
    this.id = id || crypto.randomUUID();

    this.orderId =
      typeof orderId === "string"
        ? orderId.trim()
        : "";

    this.amount =
      typeof amount === "number"
        ? amount
        : 0;

    this.currency =
      typeof currency === "string"
        ? currency.trim().toUpperCase()
        : "EUR";

    this.paymentMethod =
      typeof paymentMethod === "string"
        ? paymentMethod.trim().toLowerCase()
        : "cash";

    this.status =
      typeof status === "string"
        ? status.trim().toLowerCase()
        : "pending";

    this.transactionId =
      typeof transactionId === "string"
        ? transactionId.trim()
        : transactionId;

    this.failureReason =
      typeof failureReason === "string"
        ? failureReason.trim()
        : "";

    this.refundAmount =
      typeof refundAmount === "number"
        ? refundAmount
        : 0;

    this.refundReason =
      typeof refundReason === "string"
        ? refundReason.trim()
        : "";

    this.paidAt = paidAt;
    this.refundedAt = refundedAt;

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  updateStatus(status) {
    const allowedStatuses = [
      "pending",
      "processing",
      "paid",
      "failed",
      "refunded",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid payment status");
    }

    this.status = status;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  markAsPaid(transactionId = null) {
    if (this.status === "refunded") {
      throw new Error(
        "Refunded payment cannot be marked as paid"
      );
    }

    this.status = "paid";

    if (transactionId) {
      this.transactionId = transactionId;
    }

    this.failureReason = "";
    this.paidAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();

    return this;
  }

  markAsFailed(failureReason = "") {
    if (this.status === "paid") {
      throw new Error(
        "Paid payment cannot be marked as failed"
      );
    }

    if (this.status === "refunded") {
      throw new Error(
        "Refunded payment cannot be marked as failed"
      );
    }

    this.status = "failed";
    this.failureReason =
      typeof failureReason === "string"
        ? failureReason.trim()
        : "";

    this.updatedAt = new Date().toISOString();

    return this;
  }

  refund(refundAmount, reason = "") {
    if (this.status !== "paid") {
      throw new Error(
        "Only paid payments can be refunded"
      );
    }

    if (
      typeof refundAmount !== "number" ||
      refundAmount <= 0
    ) {
      throw new Error(
        "Refund amount must be greater than zero"
      );
    }

    const remainingRefundableAmount =
      this.amount - this.refundAmount;

    if (refundAmount > remainingRefundableAmount) {
      throw new Error(
        "Refund amount exceeds remaining payment amount"
      );
    }

    this.refundAmount += refundAmount;

    this.refundReason =
      typeof reason === "string"
        ? reason.trim()
        : "";

    if (this.refundAmount >= this.amount) {
      this.status = "refunded";
    }

    this.refundedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();

    return this;
  }

  getRemainingRefundableAmount() {
    return Math.max(
      0,
      this.amount - this.refundAmount
    );
  }

  toJSON() {
    return {
      id: this.id,
      orderId: this.orderId,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      status: this.status,
      transactionId: this.transactionId,
      failureReason: this.failureReason,
      refundAmount: this.refundAmount,
      refundReason: this.refundReason,
      remainingRefundableAmount:
        this.getRemainingRefundableAmount(),
      paidAt: this.paidAt,
      refundedAt: this.refundedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = PaymentModel;
