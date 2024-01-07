require("dotenv").config();

const config = {
  mongodbPassword: process.env.MONGO_DB_PASSWORD,
  mongodbUser: process.env.MONGO_DB_USER,
  mongodbHost: process.env.MONGO_DB_HOST,
  mongodbName: process.env.MONGO_DB_NAME,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtSecret: process.env.JWT_SECRET,
};
module.exports = config;
