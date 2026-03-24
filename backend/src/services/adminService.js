const jwt = require('jsonwebtoken');
const config = require('../config');
const { Admin } = require('../models');

class AdminService {
  generateToken(admin) {
    return jwt.sign(
      { id: admin.id, login: admin.login },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  async login(login, password) {
    const admin = await Admin.findOne({ where: { login } });
    if (!admin) {
      const error = new Error('Неверный логин или пароль');
      error.status = 401;
      throw error;
    }

    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      const error = new Error('Неверный логин или пароль');
      error.status = 401;
      throw error;
    }

    const token = this.generateToken(admin);

    return { admin, token };
  }

  async create(login, password) {
    const existing = await Admin.findOne({ where: { login } });
    if (existing) {
      const error = new Error('Администратор с таким логином уже существует');
      error.status = 409;
      throw error;
    }

    const admin = await Admin.create({ login, password });
    const token = this.generateToken(admin);

    return { admin, token };
  }
}

module.exports = new AdminService();
