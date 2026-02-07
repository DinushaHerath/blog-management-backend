const Blog = require("../models/Blog");
const User = require("../models/User");
const generateSummary = require("../utils/summary.util");
const ApiResponse = require("../utils/response.util");
const { asyncHandler } = require("../middleware/error.middleware");
const logger = require("../utils/logger.util");

// Create blog
exports.createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const summary = generateSummary(content);

  const blog = await Blog.create({
    title,
    content,
    summary,
    user_id: req.user.id
  });

  logger.info(`New blog created: ${title} by user ${req.user.id}`);

  return ApiResponse.created(res, "Blog created successfully", { blog });
});

// Get all blogs with pagination
exports.getAllBlogs = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const { count, rows } = await Blog.findAndCountAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
    include: { model: User, attributes: ["id", "name", "email"] }
  });

  return ApiResponse.paginated(
    res,
    200,
    "Blogs retrieved successfully",
    rows,
    {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  );
});

// Get blog by ID
exports.getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    include: { model: User, attributes: ["id", "name", "email"] }
  });

  if (!blog) {
    return ApiResponse.notFound(res, "Blog not found");
  }

  return ApiResponse.success(res, 200, "Blog retrieved successfully", { blog });
});

// Update blog (Owner or Admin)
exports.updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return ApiResponse.notFound(res, "Blog not found");
  }

  // Check ownership
  if (req.user.id !== blog.user_id && req.user.role !== "ADMIN") {
    return ApiResponse.forbidden(res, "Access denied");
  }

  const { title, content } = req.body;
  const summary = content ? generateSummary(content) : blog.summary;

  await blog.update({
    title: title || blog.title,
    content: content || blog.content,
    summary
  });

  logger.info(`Blog updated: ${blog.id} by user ${req.user.id}`);

  return ApiResponse.success(res, 200, "Blog updated successfully", { blog });
});

// Delete blog (Admin only)
exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return ApiResponse.notFound(res, "Blog not found");
  }

  if (req.user.role !== "ADMIN") {
    return ApiResponse.forbidden(res, "Access denied");
  }

  await blog.destroy();

  logger.info(`Blog deleted: ${blog.id} by admin ${req.user.id}`);

  return ApiResponse.success(res, 200, "Blog deleted successfully", null);
});
