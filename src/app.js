const express = require("express");
require("dotenv").config();

const sequelize = require("./config/database");

// Test connection
sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch(err => console.error("❌ MySQL connection failed:", err));


const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
