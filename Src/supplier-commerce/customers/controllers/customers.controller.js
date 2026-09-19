const customerService = require("../services/customers.service");

function createCustomer(req, res) {
  try {
    const customer = customerService.createCustomer(req.body);

    return res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

function getAllCustomers(req, res) {
  const customers = customerService.getAllCustomers();

  return res.json({
    success: true,
    data: customers
  });
}

function getCustomerById(req, res) {
  const customer = customerService.getCustomerById(req.params.id);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found"
    });
  }

  return res.json({
    success: true,
    data: customer
  });
}

function updateCustomer(req, res) {
  const customer = customerService.updateCustomer(
    req.params.id,
    req.body
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found"
    });
  }

  return res.json({
    success: true,
    data: customer
  });
}

function deleteCustomer(req, res) {
  const deleted = customerService.deleteCustomer(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Customer not found"
    });
  }

  return res.json({
    success: true,
    message: "Customer deleted"
  });
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
