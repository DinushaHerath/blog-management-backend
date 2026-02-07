const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");



const User = require("./models/User");
const Blog = require("./models/Blog");

const sequelize = require("./config/database");

// Test connection
sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch(err => console.error("❌ MySQL connection failed:", err));

sequelize.sync({ alter: true }) // creates tables or updates columns
  .then(() => console.log("✅ Database & tables synced"))
  .catch(err => console.error("❌ DB sync failed:", err));
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);


app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
