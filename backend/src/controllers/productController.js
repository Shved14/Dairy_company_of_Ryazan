const productService = require('../services/productService');

class ProductController {
  async getAll(req, res, next) {
    try {
      const { search, category, page, limit, priceMin, priceMax, fatMin, fatMax, weight, sort } = req.query;
      const result = await productService.findAll({ search, category, page, limit, priceMin, priceMax, fatMin, fatMax, weight, sort });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.findById(req.params.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await productService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
