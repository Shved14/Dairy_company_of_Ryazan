const { Router } = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = Router();

const authValidation = [
  body('login')
    .trim()
    .notEmpty().withMessage('Логин обязателен')
    .isLength({ min: 3, max: 100 }).withMessage('Логин должен быть от 3 до 100 символов'),
  body('password')
    .notEmpty().withMessage('Пароль обязателен')
    .isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
];

router.post('/login', validate(authValidation), adminController.login);

router.get('/users', auth, adminController.getAll);
router.post('/users', auth, requireRole('SUPER_ADMIN'), validate(authValidation), adminController.create);
router.delete('/users/:id', auth, requireRole('SUPER_ADMIN'), adminController.delete);

module.exports = router;
