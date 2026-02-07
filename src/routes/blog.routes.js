const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { createBlogValidation, updateBlogValidation } = require("../middleware/validation.middleware");

// Create blog → Authenticated
router.post("/", authMiddleware, createBlogValidation, blogController.createBlog);

// Get all blogs → Pagination
router.get("/", blogController.getAllBlogs);

// Get blog by ID
router.get("/:id", blogController.getBlogById);

// Update blog → Authenticated + Owner/Admin
router.put("/:id", authMiddleware, updateBlogValidation, blogController.updateBlog);

// Delete blog → Admin only
router.delete("/:id", authMiddleware, blogController.deleteBlog);

module.exports = router;
