require('dotenv').config();

const app = require('./app');
const config = require('./config');
const { sequelize } = require('./models');

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных установлено');

    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('✅ Модели синхронизированы');

    app.listen(config.port, () => {
      console.log(`🚀 Сервер запущен на порту ${config.port} (${config.nodeEnv})`);
    });
  } catch (err) {
    console.error('❌ Ошибка запуска сервера:', err.message);
    process.exit(1);
  }
};

start();
