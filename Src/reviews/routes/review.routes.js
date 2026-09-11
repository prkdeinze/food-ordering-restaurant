const express = require("express");

const {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByRestaurantId,
  getReviewsByUserId,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const {
  validateReview,
  validateReviewId,
  validateRestaurantId,
  validateUserId,
} = require("../middleware/review.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Review Routes
|--------------------------------------------------------------------------
*/

// Create a new review
router.post(
  "/",
  validateReview,
  createReview
);

// Get all reviews
router.get(
  "/",
  getAllReviews
);

// Get reviews by restaurant ID
router.get(
  "/restaurant/:restaurantId",
  validateRestaurantId,
  getReviewsByRestaurantId
);

// Get reviews by user ID
router.get(
  "/user/:userId",
  validateUserId,
  getReviewsByUserId
);

// Get one review by ID
router.get(
  "/:id",
  validateReviewId,
  getReviewById
);

// Update review
router.put(
  "/:id",
  validateReviewId,
  validateReview,
  updateReview
);

// Delete review
router.delete(
  "/:id",
  validateReviewId,
  deleteReview
);

module.exports = router;
