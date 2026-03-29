const { Op } = require('sequelize');
const { Product } = require('../models');

class ProductService {
  async findAll({ search, category, page = 1, limit = 20, priceMin, priceMax, fatMin, fatMax, weight, sort }) {
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

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price[Op.gte] = Number(priceMin);
      if (priceMax) where.price[Op.lte] = Number(priceMax);
    }

    if (fatMin !== undefined || fatMax !== undefined) {
      where.fat = {};
      if (fatMin !== undefined) where.fat[Op.gte] = Number(fatMin);
      if (fatMax !== undefined) where.fat[Op.lte] = Number(fatMax);
    }

    if (weight) {
      const weights = String(weight).split(',').map(Number).filter(Boolean);
      if (weights.length) {
        where.weight = { [Op.in]: weights };
      }
    }

    let order = [['created_at', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'newest') order = [['created_at', 'DESC']];

    const offset = (page - 1) * limit;

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      limit: Math.min(limit, 100),
      offset,
      order,
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
