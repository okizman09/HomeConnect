const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$&*])/)
      .withMessage('Password must contain at least one uppercase letter and one special character (!@#$&*)'),
    body('role').isIn(['tenant', 'landlord']).withMessage('Invalid role'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('location').notEmpty().withMessage('Location is required')
  ],
  register
);

router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
