
const registerUser = async (userData) => {
  return {
    success: true,
    message: "User registration service is working",
    data: userData
  };
};

const loginUser = async (credentials) => {
  return {
    success: true,
    message: "User login service is working",
    data: credentials
  };
};

module.exports = {
  registerUser,
  loginUser
};
