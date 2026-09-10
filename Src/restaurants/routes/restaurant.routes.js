
const express = require("express");

const router = express.Router();

const restaurantController = require("../controllers/restaurant.controller");

const {
  validateRestaurant,
  validateRestaurantEmail,
  validateRestaurantId,
  validateRestaurantStatus,
  validateDeliverySettings,
  validateCoordinates,
  validateRating
} = require("../middleware/restaurant.middleware");

router.post(
  "/",
  validateRestaurant,
  validateRestaurantEmail,
  validateDeliverySettings,
  validateCoordinates,
  restaurantController.createRestaurant
);

router.get(
  "/",
  restaurantController.getAllRestaurants
);

router.get(
  "/owner/:ownerId",
  restaurantController.getRestaurantsByOwnerId
);

router.get(
  "/slug/:slug",
  restaurantController.getRestaurantBySlug
);

router.get(
  "/:id",
  validateRestaurantId,
  restaurantController.getRestaurantById
);

router.put(
  "/:id",
  validateRestaurantId,
  validateRestaurantEmail,
  validateDeliverySettings,
  validateCoordinates,
  restaurantController.updateRestaurant
);

router.delete(
  "/:id",
  validateRestaurantId,
  restaurantController.deleteRestaurant
);

router.patch(
  "/:id/status",
  validateRestaurantId,
  validateRestaurantStatus,
  restaurantController.changeRestaurantStatus
);

router.patch(
  "/:id/verify",
  validateRestaurantId,
  restaurantController.verifyRestaurant
);

router.patch(
  "/:id/open-status",
  validateRestaurantId,
  restaurantController.setRestaurantOpenStatus
);

router.patch(
  "/:id/opening-hours",
  validateRestaurantId,
  restaurantController.updateOpeningHours
);

router.patch(
  "/:id/delivery-settings",
  validateRestaurantId,
  validateDeliverySettings,
  restaurantController.updateDeliverySettings
);

router.patch(
  "/:id/address",
  validateRestaurantId,
  validateCoordinates,
  restaurantController.updateRestaurantAddress
);

router.patch(
  "/:id/images",
  validateRestaurantId,
  restaurantController.updateRestaurantImages
);

router.patch(
  "/:id/rating",
  validateRestaurantId,
  validateRating,
  restaurantController.updateRestaurantRating
);

module.exports = router;
