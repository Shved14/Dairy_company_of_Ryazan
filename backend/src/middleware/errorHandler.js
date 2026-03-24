const config = require('../config');

const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;

  const response = {
    error: err.message || 'Внутренняя ошибка сервера',
  };

  if (err.name === 'SequelizeValidationError') {
    response.error = 'Ошибка валидации';
    response.details = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json(response);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    response.error = 'Запись с такими данными уже существует';
    response.details = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(409).json(response);
  }

  if (config.nodeEnv === 'development' && status === 500) {
    response.stack = err.stack;
  }

  if (status === 500) {
    console.error('Unhandled error:', err);
  }

  return res.status(status).json(response);
};

module.exports = errorHandler;
