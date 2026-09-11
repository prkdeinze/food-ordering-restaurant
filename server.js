const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./Src/auth/routes/auth.routes");
const couponRoutes = require("./Src/coupons/routes/coupon.routes");
const inventoryRoutes = require("./Src/inventory/routes/inventory.routes");
const menuRoutes = require("./Src/menu/routes/menu.routes");
const notificationRoutes = require("./Src/notifications/routes/notification.routes");
const orderRoutes = require("./Src/orders/routes/order.routes");
const paymentRoutes = require("./Src/payments/routes/payment.routes");
const restaurantRoutes = require("./Src/restaurants/routes/restaurant.routes");
const reviewRoutes = require("./Src/reviews/routes/review.routes");
const userRoutes = require("./Src/users/routes/user.routes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Food Ordering Restaurant API is running",
  });
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
