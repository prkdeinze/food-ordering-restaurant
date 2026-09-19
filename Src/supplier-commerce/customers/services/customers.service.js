const Customer = require("../models/customers.model");

const customers = [];

function createCustomer(data) {
  const customer = new Customer(data);
  customers.push(customer);
  return customer.toJSON();
}

function getAllCustomers() {
  return customers.map(customer => customer.toJSON());
}

function getCustomerById(id) {
  const customer = customers.find(customer => customer.id === id);
  return customer ? customer.toJSON() : null;
}

function updateCustomer(id, data) {
  const customer = customers.find(customer => customer.id === id);

  if (!customer) {
    return null;
  }

  if (data.firstName !== undefined) customer.firstName = data.firstName;
  if (data.lastName !== undefined) customer.lastName = data.lastName;
  if (data.email !== undefined) customer.email = data.email;
  if (data.phone !== undefined) customer.phone = data.phone;
  if (data.addresses !== undefined) customer.addresses = data.addresses;
  if (data.isActive !== undefined) customer.isActive = data.isActive;

  customer.updatedAt = new Date().toISOString();

  return customer.toJSON();
}

function deleteCustomer(id) {
  const index = customers.findIndex(customer => customer.id === id);

  if (index === -1) {
    return false;
  }

  customers.splice(index, 1);
  return true;
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
