const { Router } = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const validate = require('../middleware/validate');

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
router.post('/create', validate(authValidation), adminController.create);

module.exports = router;
