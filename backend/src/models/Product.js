const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Название продукта не может быть пустым' },
      len: { args: [2, 255], msg: 'Название должно быть от 2 до 255 символов' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'Цена должна быть числом' },
      min: { args: [0], msg: 'Цена не может быть отрицательной' },
    },
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Категория не может быть пустой' },
    },
  },
  fat: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    validate: {
      isDecimal: { msg: 'Жирность должна быть числом' },
      min: { args: [0], msg: 'Жирность не может быть отрицательной' },
    },
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: { msg: 'Вес должен быть числом' },
      min: { args: [0], msg: 'Вес не может быть отрицательным' },
    },
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'products',
});

module.exports = Product;
