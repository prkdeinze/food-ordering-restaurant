
const restaurantService = require("../service/restaurant.service");

const createRestaurant = async (req, res) => {
  try {
    const existingRestaurant =
      await restaurantService.getRestaurantBySlug(req.body.slug);

    if (existingRestaurant) {
      return res.status(409).json({
        success: false,
        message: "A restaurant with this slug already exists"
      });
    }

    const restaurant =
      await restaurantService.createRestaurant(req.body);

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create restaurant"
    });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants =
      await restaurantService.getAllRestaurants();

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get restaurants"
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.getRestaurantById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get restaurant"
    });
  }
};

const getRestaurantBySlug = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.getRestaurantBySlug(req.params.slug);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get restaurant"
    });
  }
};

const getRestaurantsByOwnerId = async (req, res) => {
  try {
    const restaurants =
      await restaurantService.getRestaurantsByOwnerId(
        req.params.ownerId
      );

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to get restaurants by owner"
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.updateRestaurant(
        req.params.id,
        req.body
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update restaurant"
    });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.deleteRestaurant(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete restaurant"
    });
  }
};

const changeRestaurantStatus = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.changeRestaurantStatus(
        req.params.id,
        req.body.status
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant status updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message || "Failed to change restaurant status"
    });
  }
};

const verifyRestaurant = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.verifyRestaurant(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant verified successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify restaurant"
    });
  }
};

const setRestaurantOpenStatus = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.setRestaurantOpenStatus(
        req.params.id,
        req.body.isOpen
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant open status updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message || "Failed to update restaurant open status"
    });
  }
};

const updateOpeningHours = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.updateOpeningHours(
        req.params.id,
        req.body.openingHours
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Opening hours updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update opening hours"
    });
  }
};

const updateDeliverySettings = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.updateDeliverySettings(
        req.params.id,
        req.body
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery settings updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to update delivery settings"
    });
  }
};

const updateRestaurantAddress = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.updateRestaurantAddress(
        req.params.id,
        req.body.address
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant address updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update restaurant address"
    });
  }
};

const updateRestaurantImages = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.updateRestaurantImages(
        req.params.id,
        req.body.logo,
        req.body.coverImage
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant images updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update restaurant images"
    });
  }
};

const updateRestaurantRating = async (req, res) => {
  try {
    const restaurant =
      await restaurantService.updateRestaurantRating(
        req.params.id,
        req.body.rating,
        req.body.totalReviews
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant rating updated successfully",
      data: restaurant
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update restaurant rating"
    });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantBySlug,
  getRestaurantsByOwnerId,
  updateRestaurant,
  deleteRestaurant,
  changeRestaurantStatus,
  verifyRestaurant,
  setRestaurantOpenStatus,
  updateOpeningHours,
  updateDeliverySettings,
  updateRestaurantAddress,
  updateRestaurantImages,
  updateRestaurantRating
};
