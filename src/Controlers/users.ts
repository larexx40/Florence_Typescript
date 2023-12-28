import { validationResult, body, check } from 'express-validator';
import { Request, Response } from 'express';
import User, { IUserDocument } from '../Models/users';
import {IUser} from '../Models/types';
import {addUserValidation,updateUserValidation,deleteUserValidation} from '../Validations/userValidation';

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {    
    if(req.body == '' || req.body == null || !req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }
    
    const validateRequiredFields = [
      body('email').notEmpty().withMessage("Email is required"),
      body('phoneno').notEmpty().withMessage("Phoneno is required"),
      body('password').notEmpty().withMessage("Password is required"),
    ]
    // execute validation
    validateRequiredFields.forEach((validation) => validation(req, res, () => {}));
    

    addUserValidation.forEach((validation) => validation(req, res, () => {}));
    const errors = validationResult(req);        
    if (!errors.isEmpty()) {
      // Construct a meaningful error response
      let newError = errors.array();
      //return only the msg and path from the error
      console.log(newError);      
      const errorResponse = newError.map(error => ({
        // field: error.path,
        message: error.msg
      }));
      
      res.status(422).json({ errors: errorResponse });
      return;
    }

    const { name, email, phoneno, password, username, dob, address, businessName } = req.body;
    const user : IUser = { name, email, phoneno, password, username, dob, address, businessName };
    const newUser = new User(user);
    const savedUser: IUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    
    // console.error('Error adding user:', error);
    console.log(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUserDocument[] = await User.find();
    let response = {
      status: true,
      message: (users.length > 0) ? "Users fetched" : "No record found" ,
      data: users
    }
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      status: false,
      error: 'Internal Server Error' 
    });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    updateUserValidation.forEach((validation) => validation(req, res, () => {}));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user: IUserDocument | null = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error getting user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    updateUserValidation.forEach((validation) => validation(req, res, () => {}));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    deleteUserValidation.forEach((validation) => validation(req, res, () => {}));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(`Error deleting user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};