const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Blog = sequelize.define("Blog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: "blogs"
});

// Define relationship
Blog.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Blog, { foreignKey: "user_id" });

module.exports = Blog;
