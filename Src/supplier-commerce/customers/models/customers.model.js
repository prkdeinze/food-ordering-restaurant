class Customer {
  constructor(data = {}) {
    const now = new Date().toISOString();

    this.id = data.id || `customer-${Date.now()}`;
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.email = data.email || "";
    this.phone = data.phone || "";

    this.addresses = Array.isArray(data.addresses)
      ? data.addresses
      : [];

    this.isActive =
      typeof data.isActive === "boolean"
        ? data.isActive
        : true;

    this.createdAt = data.createdAt || now;
    this.updatedAt = data.updatedAt || now;
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      addresses: this.addresses,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Customer;
