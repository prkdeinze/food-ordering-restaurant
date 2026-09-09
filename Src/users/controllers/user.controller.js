
const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile endpoint is working"
  });
};

const updateProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile update endpoint is working"
  });
};

module.exports = {
  getProfile,
  updateProfile
};
