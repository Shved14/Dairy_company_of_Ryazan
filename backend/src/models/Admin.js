const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const SALT_ROUNDS = 12;

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  login: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: { msg: 'Администратор с таким логином уже существует' },
    validate: {
      notEmpty: { msg: 'Логин не может быть пустым' },
      len: { args: [3, 100], msg: 'Логин должен быть от 3 до 100 символов' },
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пароль не может быть пустым' },
    },
  },
  role: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN'),
    allowNull: false,
    defaultValue: 'ADMIN',
  },
}, {
  tableName: 'admins',
  hooks: {
    beforeCreate: async (admin) => {
      admin.password = await bcrypt.hash(admin.password, SALT_ROUNDS);
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, SALT_ROUNDS);
      }
    },
  },
});

Admin.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

Admin.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Admin;
