const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

// GET /users → Admin only
router.get("/", authMiddleware, allowRoles("ADMIN"), userController.getAllUsers);

// GET /users/:id → Protected (admin or self)
router.get("/:id", authMiddleware, userController.getUserById);

module.exports = router;
