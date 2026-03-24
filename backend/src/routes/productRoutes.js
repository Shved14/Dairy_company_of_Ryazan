const { Router } = require('express');
const { body, param } = require('express-validator');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Название обязательно')
    .isLength({ min: 2, max: 255 }).withMessage('Название должно быть от 2 до 255 символов'),
  body('price')
    .notEmpty().withMessage('Цена обязательна')
    .isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
  body('category')
    .trim()
    .notEmpty().withMessage('Категория обязательна'),
  body('description')
    .optional()
    .trim(),
  body('fat')
    .optional()
    .isFloat({ min: 0 }).withMessage('Жирность должна быть положительным числом'),
  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Вес должен быть положительным числом'),
  body('image')
    .optional()
    .trim()
    .isURL().withMessage('Изображение должно быть валидным URL'),
];

const productUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('Название должно быть от 2 до 255 символов'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
  body('category')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('fat')
    .optional()
    .isFloat({ min: 0 }).withMessage('Жирность должна быть положительным числом'),
  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Вес должен быть положительным числом'),
  body('image')
    .optional()
    .trim()
    .isURL().withMessage('Изображение должно быть валидным URL'),
];

const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID должен быть положительным целым числом'),
];

router.get('/', productController.getAll);
router.get('/:id', validate(idValidation), productController.getById);
router.post('/', auth, validate(productValidation), productController.create);
router.put('/:id', auth, validate([...idValidation, ...productUpdateValidation]), productController.update);
router.delete('/:id', auth, validate(idValidation), productController.delete);

module.exports = router;
