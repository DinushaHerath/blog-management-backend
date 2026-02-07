const User = require("../models/User");
const ApiResponse = require("../utils/response.util");
const { asyncHandler } = require("../middleware/error.middleware");

// GET all users (Admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "created_at"]
  });

  return ApiResponse.success(res, 200, "Users retrieved successfully", { users });
});

// GET user by ID (Protected)
exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Optionally, allow user to see only their own data (or admin)
  if (req.user.id != id && req.user.role !== "ADMIN") {
    return ApiResponse.forbidden(res, "Access denied");
  }

  const user = await User.findByPk(id, {
    attributes: ["id", "name", "email", "role", "created_at"]
  });

  if (!user) {
    return ApiResponse.notFound(res, "User not found");
  }

  return ApiResponse.success(res, 200, "User retrieved successfully", { user });
});
