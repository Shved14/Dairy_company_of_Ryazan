require('dotenv').config();

const { sequelize, Admin, Product } = require('./models');

const products = [
  {
    name: 'Молоко цельное 3.2%',
    description: 'Натуральное цельное коровье молоко от рязанских фермеров. Пастеризованное, без добавок.',
    price: 89,
    category: 'Молоко',
    fat: 3.2,
    weight: 930,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80',
  },
  {
    name: 'Молоко топлёное 4%',
    description: 'Томлёное в печи молоко с нежным карамельным вкусом. Идеально для каши и выпечки.',
    price: 109,
    category: 'Молоко',
    fat: 4.0,
    weight: 500,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
  },
  {
    name: 'Кефир классический 2.5%',
    description: 'Кефир на живой закваске, богатый пробиотиками. Улучшает пищеварение.',
    price: 75,
    category: 'Кефир',
    fat: 2.5,
    weight: 500,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
  },
  {
    name: 'Кефир обезжиренный 1%',
    description: 'Лёгкий кефир для тех, кто следит за фигурой. Все полезные свойства при минимуме калорий.',
    price: 69,
    category: 'Кефир',
    fat: 1.0,
    weight: 500,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80',
  },
  {
    name: 'Сметана домашняя 20%',
    description: 'Густая деревенская сметана. Идеальна для борща, блинов и заправки салатов.',
    price: 125,
    category: 'Сметана',
    fat: 20.0,
    weight: 350,
    image: 'https://images.unsplash.com/photo-1595424061998-be24d4ae0afb?w=600&q=80',
  },
  {
    name: 'Сметана нежная 15%',
    description: 'Сметана средней жирности с мягким сливочным вкусом. Универсальна в использовании.',
    price: 99,
    category: 'Сметана',
    fat: 15.0,
    weight: 300,
    image: 'https://images.unsplash.com/photo-1587657582809-720cb1ee5e04?w=600&q=80',
  },
  {
    name: 'Творог зернёный 5%',
    description: 'Нежный зернёный творог — источник белка и кальция. Отличный завтрак для всей семьи.',
    price: 149,
    category: 'Творог',
    fat: 5.0,
    weight: 300,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80',
  },
  {
    name: 'Творог домашний 9%',
    description: 'Классический домашний творог ручной работы. Идеален для сырников и запеканок.',
    price: 179,
    category: 'Творог',
    fat: 9.0,
    weight: 400,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&q=80',
  },
  {
    name: 'Масло сливочное 82.5%',
    description: 'Натуральное сливочное масло высшего сорта. Изготовлено из свежих сливок методом сбивания.',
    price: 199,
    category: 'Масло',
    fat: 82.5,
    weight: 200,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80',
  },
  {
    name: 'Сыр «Рязанский» полутвёрдый',
    description: 'Полутвёрдый сыр собственного производства с насыщенным молочным вкусом. Выдержка 60 дней.',
    price: 349,
    category: 'Сыр',
    fat: 45.0,
    weight: 300,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80',
  },
  {
    name: 'Йогурт натуральный',
    description: 'Йогурт без добавок на живых бактериальных культурах. Основа для смузи и десертов.',
    price: 89,
    category: 'Йогурт',
    fat: 3.5,
    weight: 250,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  },
  {
    name: 'Йогурт клубничный',
    description: 'Натуральный йогурт с кусочками свежей клубники. Без искусственных красителей.',
    price: 99,
    category: 'Йогурт',
    fat: 2.5,
    weight: 250,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80',
  },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ БД подключена');

    await sequelize.sync({ alter: true });
    console.log('✅ Модели синхронизированы');

    // Create admin
    // Clear all admins and create only misha
    await Admin.destroy({ where: {}, truncate: true, cascade: true });
    await Admin.create({ login: 'misha', password: 'developer', role: 'SUPER_ADMIN' });
    console.log('✅ Админ создан: misha / developer (SUPER_ADMIN)');

    // Create products
    const existingCount = await Product.count();
    if (existingCount > 0) {
      console.log(`⚠️  В базе уже ${existingCount} товаров, пропускаю`);
    } else {
      await Product.bulkCreate(products);
      console.log(`✅ Создано ${products.length} товаров`);
    }

    console.log('\n🎉 Сидирование завершено!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  }
};

seed();
