const jwt = require('jsonwebtoken');
const config = require('../config');
const { Admin } = require('../models');

class AdminService {
  generateToken(admin) {
    return jwt.sign(
      { id: admin.id, login: admin.login, role: admin.role },
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

    const admin = await Admin.create({ login, password, role: 'ADMIN' });
    return { admin };
  }

  async getAll() {
    const admins = await Admin.findAll({
      attributes: ['id', 'login', 'role', 'createdAt'],
      order: [['id', 'ASC']],
    });
    return admins;
  }

  async delete(id, requesterId) {
    if (Number(id) === Number(requesterId)) {
      const error = new Error('Нельзя удалить самого себя');
      error.status = 400;
      throw error;
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      const error = new Error('Администратор не найден');
      error.status = 404;
      throw error;
    }

    if (admin.role === 'SUPER_ADMIN') {
      const error = new Error('Нельзя удалить SUPER_ADMIN');
      error.status = 403;
      throw error;
    }

    await admin.destroy();
    return { message: 'Администратор удалён' };
  }
}

module.exports = new AdminService();
