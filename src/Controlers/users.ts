import { validationResult, body, check } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import User, { IUserDocument } from '../Models/users';
import {IUser} from '../Models/types';
import {addUserValidation,updateUserValidation,deleteUserValidation} from '../Validations/userValidation';
import { OTPExpiryTime, generateVerificationOTP, hashPassword } from '../Utils/utils';
import dotenv from 'dotenv'
import { signJwt } from '../Utils/jwt';

dotenv.config()

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
//signup
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if(req.body == '' || req.body == null || !req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ status: false, message: "Request body is required" });
    return;
  }

  const { name, email, phoneno, username, dob, address, businessName } = req.body;
  if(!name || !email || !phoneno || !req.body.password) {
    res.status(400).json({ status: false, message: "Pass all required fields" });
    return;
  }
  const verification_token : number = generateVerificationOTP(); 
  //current time + 5 mins
  const verification_token_time : Date = new Date(Date.now() + OTPExpiryTime);
  const password =  await hashPassword(req.body.password);

  try {
    const user : IUser = { name, email, phoneno, password, username, dob, address, businessName, verification_token, verification_token_time };
    const newUser = new User(user);
    let savedUser: IUser = await newUser.save();
    const payload = {
      email: savedUser.email,
      userid: savedUser._id,
      role: savedUser.role, 
    }
    const authToken = signJwt(payload, '1h');
    res.status(201).json({ status: true, message: 'User created successfully', data: savedUser, authToken });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
    console.log(error);
    
  }

 
}
//verifyEmailToken
export const verifyEmailToken = async (req: Request, res: Response): Promise<void> => {
  if(!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ status: false, message: "Request body is required" });
    return;
  }
  const { email, verification_token } = req.body;
  if(!email || !verification_token) {
    res.status(400).json({ status: false, message: "Pass all required fields" });
    return;
  }
  const user: IUserDocument | null = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  //compare verivication token with db
  if(user.verification_token !== verification_token) {
    res.status(401).json({ error: 'Invalid verification token' });
    return;
  }
  //check if token is expired

  if(user?.verification_token_time && user.verification_token_time < new Date()) {
    res.status(401).json({ error: 'Verification token expired' });
    return;
  }
  //update user email_verified to true
  user.email_verified = true;
  user.verification_token = null;
  user.verification_token_time = '';
  await user.save();

  res.status(200).json({ status: true, message: 'Email verified successfully' });

}
//resend verifyemailToken
//login
//resetPasswordToken
//verifyResetPasswordToken
//resetPassword
//profileDetails
//updatePhoneno
//updateProfile