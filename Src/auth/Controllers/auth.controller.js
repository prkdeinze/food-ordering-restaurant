const register = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Register endpoint is working"
  });
};

const login = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Login endpoint is working"
  });
};

module.exports = {
  register,
  login
};
