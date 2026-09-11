const ReviewModel = require("../models/review.model");

const reviews = new Map();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create a new review
const createReview = async (data = {}) => {
  if (!data.userId) {
    throw createError("User ID is required", 400);
  }

  if (!data.restaurantId) {
    throw createError("Restaurant ID is required", 400);
  }

  if (
    typeof data.rating !== "number" ||
    !Number.isInteger(data.rating) ||
    data.rating < 1 ||
    data.rating > 5
  ) {
    throw createError(
      "Rating must be an integer from 1 to 5",
      400
    );
  }

  const duplicateReview = Array.from(
    reviews.values()
  ).find(
    (review) =>
      review.userId === data.userId &&
      review.restaurantId === data.restaurantId &&
      (
        !data.orderId ||
        review.orderId === data.orderId
      )
  );

  if (duplicateReview) {
    throw createError(
      "Review already exists",
      409
    );
  }

  const review = new ReviewModel(data);

  reviews.set(review.id, review);

  return review.toJSON();
};

// Get all reviews
const getAllReviews = async () => {
  return Array.from(reviews.values())
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .map((review) => review.toJSON());
};

// Get review by ID
const getReviewById = async (id) => {
  const review = reviews.get(id);

  if (!review) {
    throw createError(
      "Review not found",
      404
    );
  }

  return review.toJSON();
};

// Get reviews by restaurant ID
const getReviewsByRestaurantId = async (
  restaurantId
) => {
  const restaurantReviews = Array.from(
    reviews.values()
  )
    .filter(
      (review) =>
        review.restaurantId === restaurantId
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  return restaurantReviews.map(
    (review) => review.toJSON()
  );
};

// Get reviews by user ID
const getReviewsByUserId = async (
  userId
) => {
  const userReviews = Array.from(
    reviews.values()
  )
    .filter(
      (review) =>
        review.userId === userId
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  return userReviews.map(
    (review) => review.toJSON()
  );
};

// Update review
const updateReview = async (
  id,
  data = {}
) => {
  const review = reviews.get(id);

  if (!review) {
    throw createError(
      "Review not found",
      404
    );
  }

  try {
    review.update(data);
  } catch (error) {
    throw createError(
      error.message || "Failed to update review",
      400
    );
  }

  reviews.set(review.id, review);

  return review.toJSON();
};

// Delete review
const deleteReview = async (id) => {
  const review = reviews.get(id);

  if (!review) {
    throw createError(
      "Review not found",
      404
    );
  }

  reviews.delete(id);

  return true;
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
