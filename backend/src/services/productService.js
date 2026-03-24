const { Op } = require('sequelize');
const { Product } = require('../models');

class ProductService {
  async findAll({ search, category, page = 1, limit = 20 }) {
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const offset = (page - 1) * limit;

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      limit: Math.min(limit, 100),
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      const error = new Error('Продукт не найден');
      error.status = 404;
      throw error;
    }
    return product;
  }

  async create(data) {
    return Product.create(data);
  }

  async update(id, data) {
    const product = await this.findById(id);
    return product.update(data);
  }

  async delete(id) {
    const product = await this.findById(id);
    await product.destroy();
    return { message: 'Продукт успешно удалён' };
  }
}

module.exports = new ProductService();
