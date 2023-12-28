import { body, param } from 'express-validator';

// Validation for adding a new user
export const addUserValidation = [
  body('username').isString().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneno').isString().matches(/^\d{15}$/).withMessage('Please enter a valid phone number'),
  body('dob').isDate().withMessage('Invalid date of birth'),
  // Add more validation rules as needed
];

// Validation for updating a user
export const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('username').isString().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneno').isString().matches(/^\d{15}$/).withMessage('Please enter a valid phone number'),
  body('dob').isDate().withMessage('Invalid date of birth'),
  // Add more validation rules as needed
];

// Validation for deleting a user
export const deleteUserValidation = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];