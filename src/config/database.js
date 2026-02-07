const { Sequelize } = require("sequelize");

// Read .env variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // set true to see SQL queries
  }
);

module.exports = sequelize;
