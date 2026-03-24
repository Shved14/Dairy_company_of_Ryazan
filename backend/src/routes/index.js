const { Router } = require('express');
const productRoutes = require('./productRoutes');
const adminRoutes = require('./adminRoutes');

const router = Router();

router.use('/products', productRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
