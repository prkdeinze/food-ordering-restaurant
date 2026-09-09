
const getUserProfile = async (userId) => {
  return {
    success: true,
    message: "User profile service is working",
    userId
  };
};

const updateUserProfile = async (userId, userData) => {
  return {
    success: true,
    message: "User profile update service is working",
    userId,
    data: userData
  };
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
