const sequelize = require('../config/database');
const Product = require('./Product');
const Admin = require('./Admin');

module.exports = {
  sequelize,
  Product,
  Admin,
};
