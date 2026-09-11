const crypto = require("crypto");

class ReviewModel {
  constructor({
    id,
    userId,
    restaurantId,
    orderId = null,
    rating,
    comment = "",
    isApproved = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id || crypto.randomUUID();

    this.userId =
      typeof userId === "string"
        ? userId.trim()
        : "";

    this.restaurantId =
      typeof restaurantId === "string"
        ? restaurantId.trim()
        : "";

    this.orderId =
      typeof orderId === "string"
        ? orderId.trim()
        : orderId;

    this.rating =
      typeof rating === "number"
        ? rating
        : 0;

    this.comment =
      typeof comment === "string"
        ? comment.trim()
        : "";

    this.isApproved =
      typeof isApproved === "boolean"
        ? isApproved
        : true;

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  update(data = {}) {
    if (data.rating !== undefined) {
      if (
        typeof data.rating !== "number" ||
        !Number.isInteger(data.rating) ||
        data.rating < 1 ||
        data.rating > 5
      ) {
        throw new Error(
          "Rating must be an integer from 1 to 5"
        );
      }

      this.rating = data.rating;
    }

    if (data.comment !== undefined) {
      if (typeof data.comment !== "string") {
        throw new Error("Comment must be text");
      }

      this.comment = data.comment.trim();
    }

    if (data.isApproved !== undefined) {
      if (typeof data.isApproved !== "boolean") {
        throw new Error(
          "isApproved must be true or false"
        );
      }

      this.isApproved = data.isApproved;
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  approve() {
    this.isApproved = true;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  reject() {
    this.isApproved = false;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      restaurantId: this.restaurantId,
      orderId: this.orderId,
      rating: this.rating,
      comment: this.comment,
      isApproved: this.isApproved,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = ReviewModel;
