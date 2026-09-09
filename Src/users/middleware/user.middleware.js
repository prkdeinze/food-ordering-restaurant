
const userMiddleware = (req, res, next) => {
  // User-specific checks will be added here later
  next();
};

module.exports = userMiddleware;
