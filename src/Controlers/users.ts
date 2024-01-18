import { validationResult, body, check } from "express-validator";
import { NextFunction, Request, Response } from "express";
import User, { IUserDocument } from "../Models/users";
import { IUser, UserProfile } from "../Models/types";
import {
  addUserValidation,
  updateUserValidation,
  deleteUserValidation,
} from "../Validations/userValidation";
import {
  OTPExpiryTime,
  comparePassword,
  generateVerificationOTP,
  hashPassword,
} from "../Utils/utils";
import dotenv from "dotenv";
import { signJwt } from "../Utils/jwt";
import { EmailOption, AuthTokenPayload, EmailWithTemplate } from "../Types/types";
import { sendEmailSG } from "../Utils/sendgrid";
import { checkIfExist, getUser, updateUser } from "../Repositories/users";
import { sendMailNM } from "../Utils/nodemailer";
import mongoose from "mongoose";
import * as path from 'path';

dotenv.config();

declare module "express" {
  interface Request {
    user?: AuthTokenPayload;
  }
}
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (
      req.body == "" ||
      req.body == null ||
      !req.body ||
      Object.keys(req.body).length === 0
    ) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }

    const validateRequiredFields = [
      body("email").notEmpty().withMessage("Email is required"),
      body("phoneno").notEmpty().withMessage("Phoneno is required"),
      body("password").notEmpty().withMessage("Password is required"),
    ];
    // execute validation
    validateRequiredFields.forEach((validation) =>
      validation(req, res, () => {})
    );

    addUserValidation.forEach((validation) => validation(req, res, () => {}));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Construct a meaningful error response
      let newError = errors.array();
      //return only the msg and path from the error
      console.log(newError);
      const errorResponse = newError.map((error) => ({
        // field: error.path,
        message: error.msg,
      }));

      res.status(422).json({ errors: errorResponse });
      return;
    }

    const {
      name,
      email,
      phoneno,
      password,
      username,
      dob,
      address,
      businessName,
      role,
    } = req.body;
    const user: IUser = {
      name,
      email,
      phoneno,
      password,
      username,
      dob,
      address,
      businessName,
      role,
    };
    const newUser = new User(user);
    const savedUser: IUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    // console.error('Error adding user:', error);
    console.log(error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUserDocument[] = await User.find();
    let response = {
      status: true,
      message: users.length > 0 ? "Users fetched" : "No record found",
      data: users,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      status: false,
      error: "Internal Server Error",
    });
  }
};

export const getUserdetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if(req.params.id){
      res.status(404).json({ status: false, message: "Pass user id" });
      return;
    }

    const user: IUserDocument | null = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error getting user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if(req.params.id){
      res.status(404).json({ status: false, message: "Pass user id" });
      return;
    }

    updateUserValidation.forEach((validation) =>
      validation(req, res, () => {})
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    deleteUserValidation.forEach((validation) =>
      validation(req, res, () => {})
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(`Error deleting user with ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (
    req.body == "" ||
    req.body == null ||
    !req.body ||
    Object.keys(req.body).length === 0
  ) {
    res
      .status(400)
      .json({ status: false, message: "Request body is required" });
    return;
  }

  //user validation to avoid breaking server
  const validateRequiredFields = [
    body("email").notEmpty().withMessage("Email is required"),
    body("phoneno").notEmpty().withMessage("Phoneno is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
  // execute validation
  validateRequiredFields.forEach((validation) =>
    validation(req, res, () => {})
  );

  addUserValidation.forEach((validation) => validation(req, res, () => {}));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Construct a meaningful error response
    let newError = errors.array();
    //return only the msg and path from the error
    console.log(newError);
    const errorResponse = newError.map((error) => ({
      // field: error.path,
      message: error.msg,
    }));

    res.status(422).json({ errors: errorResponse });
    return;
  }

  const { name, email, phoneno, username, dob, address, businessName, role } =
    req.body;
  if (!name || !email || !phoneno || !req.body.password || role) {
    res
      .status(400)
      .json({ status: false, message: "Pass all required fields" });
    return;
  }

  //validate password, email and username

  const { JWT_EXPIRY, ACTIVE_MAIL_SYSTEM  } = process.env;
  const verification_token: number = generateVerificationOTP();
  //current time + 5 mins
  const verification_token_time: Date = new Date(Date.now() + OTPExpiryTime);
  const password = await hashPassword(req.body.password);

  try {
    // confirm if the mail exist
    const isExist = await checkIfExist({email: email});
    if (isExist) {
      res
      .status(400)
      .json({ status: false, message: "Account with email already exist" });
      return;
    }

    const user: IUser = {
      name,
      email,
      phoneno,
      password,
      username,
      dob,
      address,
      businessName,
      role,
      verification_token,
      verification_token_time,
    };
    const newUser = new User(user);
    let savedUser = await newUser.save();
    const payload: AuthTokenPayload = {
      email: savedUser.email,
      userid: savedUser._id,
      role: savedUser.role,
    };
    const authToken = signJwt(payload);
    let emailHtml = `<h1>Your OTP is ${verification_token}</h1>`;
    const text = `Your OTP is ${verification_token}`;
    const subject = "OTP Verification";

    //email template using handlebar
    
    const signUpEmail: EmailWithTemplate = {
      to: savedUser.email,
      subject,
      text,
      // html: emailHtml,
      template: 'signup',
      context: {
        name: savedUser.username || savedUser.name
      }
    };

    const signupOTPEmail: EmailWithTemplate = {
      to: savedUser.email,
      subject: "Verification OTP",
      text,
      template: 'signup-otp',
      context: {
        name: savedUser.username || savedUser.name
      }
    }

    
    const sendSignupEmail =(ACTIVE_MAIL_SYSTEM === "2")? await sendEmailSG(signUpEmail): await sendMailNM(signUpEmail);
    if(sendSignupEmail){
      const sendOTPEmail =(ACTIVE_MAIL_SYSTEM === "2")? await sendEmailSG(signupOTPEmail): await sendMailNM(signupOTPEmail);
    }
    const userResponse: UserProfile ={
      _id: savedUser._id,
      name: savedUser.name,
      username: savedUser.username,
      email: savedUser.email,
      phoneno: savedUser.phoneno,
      dob: savedUser.dob,
      address: savedUser.address,
      balance: savedUser.balance,
      role: savedUser.role,
      toBalance: savedUser.toBalance,
      businessName: savedUser.businessName,
      status: savedUser.status,
      email_verified: savedUser.email_verified,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    }
    res
      .status(201)
      .json({
        status: true,
        message: "User created successfully",
        data: userResponse,
        authToken,
      });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ status: false, error: 'Validation failed', messages: validationErrors });
    }
    res.status(500).json({ status: false, message: "Internal server error" });
    console.log(error);
  }
};
//verifyEmailToken
export const verifyEmailToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ status: false, message: "Request body is required" });
    return;
  }
  const { verification_token } = req.body;
  if (!verification_token) {
    res
      .status(400)
      .json({ status: false, message: "Pass verification OTP sent to your mail" });
    return;
  }
  const email = req.user?.email;
  const user: IUserDocument | null = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  //compare verivication token with db
  if (user.verification_token !== verification_token) {
    res.status(401).json({ error: "Invalid verification token" });
    return;
  }
  //check if token is expired

  if (
    user?.verification_token_time &&
    user.verification_token_time < new Date()
  ) {
    res.status(401).json({ error: "Verification token expired" });
    return;
  }
  //update user email_verified to true
  user.email_verified = true;
  user.verification_token = null;
  user.verification_token_time = "";
  await user.save();

  res
    .status(200)
    .json({ status: true, message: "Email verified successfully" });
};
//resend verifyemailToken
export const resendEmailToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ status: false, message: "Request body is required" });
    return;
  }
  if (!req.user) {
    res
      .status(400)
      .json({ status: false, message: "User not authenticated" });
    return;
  }
  const email = req.user.email;
  if (!email) {
    res.status(401).json({ status: false, message: "User not unauthorized" });
    return;
  }
  //verify email
  //update token and verify time
  const verification_token: number = generateVerificationOTP();
  //OTP expiry time = current time + 5 mins
  const verification_token_time: Date = new Date(Date.now() + OTPExpiryTime);

  try {
    //update if email exist else wrong mail
    const updateUserToken = await updateUser(
      { email },
      { verification_token, verification_token_time }
    );
    if (!updateUserToken) {
      res
        .status(404)
        .json({ status: false, message: "User with email not found" });
      return;
    }
    //send emailOTP
    let emailHtml = `<h1>Your OTP is ${verification_token}</h1>`;
    const text = `Your OTP is ${verification_token}`;
    const subject = "OTP Verification";
    const EmailOption: EmailOption = {
      to: email,
      subject,
      text,
      html: emailHtml,
    };

    
    const { ACTIVE_MAIL_SYSTEM } = process.env;
    const sendOTPEmail =(ACTIVE_MAIL_SYSTEM === "2")? await sendEmailSG(EmailOption): await sendMailNM(EmailOption);
    res.status(201).json({ status: true, message: "Verification OTP sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//login
export const login = async (req: Request, res: Response): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ status: false, message: "Request body is required" });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ status: false, message: "Pass all required field" });
    return;
  }

  try {
    //get user
    const whereClause = {
      email: email
    }

    const user = await getUser(whereClause);
    if (!user) {
      res
        .status(400)
        .json({ status: false, message: "User with email not exist" });
      return;
    }
    const hashedPassword: string | undefined = user?.password;

    //compare both password
    if (!hashedPassword) {
      res.status(400).json({ status: false, message: "Invalid password" });
    }

    const isMatch = await comparePassword(password, hashedPassword);
    if (!isMatch) {
      res.status(400).json({ status: false, message: "Invalid password" });
      return;
    }
    
    
    const { JWT_EXPIRY, ACTIVE_MAIL_SYSTEM } = process.env;
    // send email OTP if email not verified
    if (!user?.email_verified) {
      //send verification OTP to user email
      const verification_token: number = generateVerificationOTP();
      //OTP expiry time = current time + 5 mins
      const verification_token_time: Date = new Date(
        Date.now() + OTPExpiryTime
      );
      //update if email exist else wrong mail
      const updateUserToken = await updateUser(
        { email },
        { verification_token, verification_token_time }
      );
      if (updateUserToken) {
        //send emailOTP
        let emailHtml = `<h1>Your OTP is ${verification_token}</h1>`;
        const text = `Your OTP is ${verification_token}`;
        const subject = "OTP Verification";
        const EmailOption: EmailOption = {
          to: email,
          subject,
          text,
          html: emailHtml,
        };

        const sendOTPEmail =(ACTIVE_MAIL_SYSTEM === "2")? await sendEmailSG(EmailOption): await sendMailNM(EmailOption);
      }
    }

    //generate token
    const payload: AuthTokenPayload = {
      userid: user._id,
      email: user.email,
      role: user.role,
    };
    const authToken = signJwt(payload);


    res.status(200).json({
      status: true,
      message: (user?.email_verified)? "Login successfull":"Login successfull.Please verify your email",
      data: user,
      email_verified: user?.email_verified,
      authToken: authToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
//resetPasswordToken
export const resetPasswordToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ status: false, message: "Request body is required" });
    return;
  }
  const {email, otp, newPassword} = req.body;
  if (!otp || !newPassword) {
    res.status(400).json({ status: false, message: "Pass all required field" });
    return;
  }

  try {
    const user = await getUser({email});
    if (!user) {
      res.status(400).json({ status: false, message: "User with email not exist" });
      return;
    }

    //verify the OTP
    if (user.verification_token !== otp) {
      res.status(400).json({ status: false, message: "Invalid OTP" });
      return;
    }
    //verify the OTP expiry
    if (user?.verification_token_time && user.verification_token_time < new Date()) {
        res.status(400).json({ status: false, message: "OTP expired" });
    }

    //hash and update the password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.verification_token = null;
    user.verification_token_time = "";
    const updateUserPassword = await updateUser({email}, user);
    if (updateUserPassword) {
      res.status(200).json({ status: true, message: "Password changed successfully" });
    }

  } catch (error) {
    
  }

}
//forgetPassword
export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ status: false, message: "Request body is required" });
    return;
  }

  const email = req.body.email;
  if(!email) {
    res.status(400).json({ status: false, message: "Email is required" });
    return;
  }

  
  const { ACTIVE_MAIL_SYSTEM } = process.env;
  const verification_token: number = generateVerificationOTP();
  //current time + 5 mins
  const verification_token_time: Date = new Date(Date.now() + OTPExpiryTime);

  try {
    const user = await getUser({email});
    if(!user) {
      res.status(400).json({ status: false, message: "User with email not exist" });
      return;
    }
    const updateUserToken = await updateUser(
      { email },
      { verification_token, verification_token_time }
    );
    if (!updateUserToken) {
      res.status(400).json({ status: false, message: "Internal server error" });
      return;
    }

    let emailHtml = `<h1>Your OTP is ${verification_token}</h1>`;
    const text = `Your OTP is ${verification_token}`;
    const subject = "OTP Verification";
    const EmailOption: EmailOption = {
      to: email,
      subject,
      text,
      html: emailHtml,
    };
    
    const sendOTPEmail =(ACTIVE_MAIL_SYSTEM === "2")? await sendEmailSG(EmailOption): await sendMailNM(EmailOption);
    if(!sendOTPEmail) {
      res.status(400).json({ status: false, message: "Unable to send OTP via email" });
      return;
    }

    res.status(200).json({ status: true, message: "OTP sent to your email" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
    
  }

  
}
//profileDetails
export const userProfile = async (req: Request, res: Response): Promise<void> => {
    if(!req.user){
        res.status(400).json({ status: false, message: "User not authenticated" });
        return;
    }
    const email = req.user.email;
    const user = await getUser({email});

    if(!user) {
        res.status(400).json({ status: false, message: "User not found" });
        return;
    }
    let profile: UserProfile = user
    //unset password from user
    res.status(200).json({ status: true, message: "User profile fetched", data: profile });
}
//updatePhoneno
export const updatePhoneno = async(req: Request, res: Response): Promise<void> =>{
    if(!req.user){
      res.status(400).json({ status: false, message: "User not authenticated" });
      return;
    }
    const email = req.user.email;
    if (!req.body || Object.keys(req.body).length === 0) {
        res
            .status(400)
            .json({ status: false, message: "Request body is required" });
        return;
    }
    const phoneno = req.body.phoneno;
    if(!phoneno) {
        res.status(400).json({ status: false, message: "Phoneno is required" });
        return;
    }

    //generate verification token and expiry time and patch;
    const verification_token: number = generateVerificationOTP();
    //current time + 5 mins
    const verification_token_time: Date = new Date(Date.now() + OTPExpiryTime);

    const updateValue = {
      phoneno: phoneno, 
      verification_token:verification_token,
      verification_token_time: verification_token_time
    };

    try{
      const update = await updateUser({email}, updateValue)
      if (!update){
        res.status(400).json({ status: false, message: "Internal server error" });
        return;
      }
      //send sms code

    }catch(error){
      console.log(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }



}
//verifyPhone
export const verfyPhoneno = async(req: Request, res: Response): Promise<void> =>{

}
//updateProfile
