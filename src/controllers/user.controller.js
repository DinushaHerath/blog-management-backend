const User = require("../models/User");

// GET all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "created_at"]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET user by ID (Protected)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Optionally, allow user to see only their own data (or admin)
    if (req.user.id != id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "created_at"]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
