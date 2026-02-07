const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");
const logger = require("./utils/logger.util");

const User = require("./models/User");
const Blog = require("./models/Blog");
const sequelize = require("./config/database");

// Initialize Express app
const app = express();

// Database connection
sequelize.authenticate()
  .then(() => logger.info("✅ MySQL connected successfully"))
  .catch(err => logger.error("❌ MySQL connection failed:", err));

sequelize.sync({ alter: false }) // Safe for production - doesn't drop tables
  .then(() => logger.info("✅ Database & tables synced"))
  .catch(err => logger.error("❌ DB sync failed:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// CORS (if needed for frontend)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blog Management API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/auth (register, login)",
      users: "/users (list, get by id)",
      blogs: "/blogs (CRUD operations)"
    }
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
