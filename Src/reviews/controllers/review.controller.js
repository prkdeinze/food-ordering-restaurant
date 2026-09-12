const reviewService = require("../services/review.service");

// Create a new review
const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body);

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get reviews",
    });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get review",
    });
  }
};

// Get reviews by restaurant ID
const getReviewsByRestaurantId = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByRestaurantId(
      req.params.restaurantId
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get restaurant reviews",
    });
  }
};

// Get reviews by user ID
const getReviewsByUserId = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByUserId(
      req.params.userId
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get user reviews",
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByRestaurantId,
  getReviewsByUserId,
  updateReview,
  deleteReview,
};
