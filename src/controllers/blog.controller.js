const Blog = require("../models/Blog");
const User = require("../models/User");
const generateSummary = require("../utils/summary.util");

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const summary = generateSummary(content);

    const blog = await Blog.create({
      title,
      content,
      summary,
      user_id: req.user.id
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all blogs with pagination
exports.getAllBlogs = async (req, res) => {
  try {
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

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      blogs: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: { model: User, attributes: ["id", "name", "email"] }
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update blog (Owner or Admin)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check ownership
    if (req.user.id !== blog.user_id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, content } = req.body;
    const summary = content ? generateSummary(content) : blog.summary;

    await blog.update({ title: title || blog.title, content: content || blog.content, summary });

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete blog (Admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Access denied" });

    await blog.destroy();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
