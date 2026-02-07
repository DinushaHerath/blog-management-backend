const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/response.util");
const { asyncHandler } = require("../middleware/error.middleware");
const logger = require("../utils/logger.util");

// REGISTER
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return ApiResponse.badRequest(res, "Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "USER"
  });

  logger.info(`New user registered: ${email}`);

  return ApiResponse.created(res, "User registered successfully", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// LOGIN
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return ApiResponse.badRequest(res, "Invalid credentials");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return ApiResponse.badRequest(res, "Invalid credentials");
  }

  // Create JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  logger.info(`User logged in: ${email}`);

  return ApiResponse.success(res, 200, "Login successful", {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
