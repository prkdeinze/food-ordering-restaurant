const crypto = require("crypto");

class NotificationModel {
  constructor({
    id,
    userId,
    title,
    message,
    type = "general",
    orderId = null,
    isRead = false,
    readAt = null,
    createdAt,
    updatedAt,
  }) {
    this.id = id || crypto.randomUUID();

    this.userId =
      typeof userId === "string"
        ? userId.trim()
        : "";

    this.title =
      typeof title === "string"
        ? title.trim()
        : "";

    this.message =
      typeof message === "string"
        ? message.trim()
        : "";

    this.type =
      typeof type === "string"
        ? type.trim().toLowerCase()
        : "general";

    this.orderId =
      typeof orderId === "string"
        ? orderId.trim()
        : orderId;

    this.isRead =
      typeof isRead === "boolean"
        ? isRead
        : false;

    this.readAt = readAt;

    this.createdAt =
      createdAt || new Date().toISOString();

    this.updatedAt =
      updatedAt || new Date().toISOString();
  }

  markAsRead() {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
    }

    return this;
  }

  markAsUnread() {
    this.isRead = false;
    this.readAt = null;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  update(data = {}) {
    const allowedFields = [
      "title",
      "message",
      "type",
      "orderId",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });

    if (typeof data.title === "string") {
      this.title = data.title.trim();
    }

    if (typeof data.message === "string") {
      this.message = data.message.trim();
    }

    if (typeof data.type === "string") {
      this.type = data.type
        .trim()
        .toLowerCase();
    }

    if (typeof data.orderId === "string") {
      this.orderId = data.orderId.trim();
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      message: this.message,
      type: this.type,
      orderId: this.orderId,
      isRead: this.isRead,
      readAt: this.readAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = NotificationModel;
