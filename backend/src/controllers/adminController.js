const adminService = require('../services/adminService');

class AdminController {
  async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const result = await adminService.login(login, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { login, password } = req.body;
      const result = await adminService.create(login, password);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const admins = await adminService.getAll();
      res.json(admins);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await adminService.delete(req.params.id, req.admin.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
