import  {Schema, model, Document} from 'mongoose'
import { IUser } from './types';


// Extend the Document interface to include methods or fields specific to your model
interface IUserDocument extends IUser, Document {}
// Define the user schema
const userSchema = new Schema <IUserDocument> ({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  phoneno: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^\d{15}$/, 'Please enter a valid phone number'],
  },
  dob: {
    type: Date,
    //greter than current date - 18yrs
    validate: {
      validator: function (value: Date) {
        return value < new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000);
      },
      message: 'You must be at least 18 years old',
    }
  },
  address: {
      type: String,
  },
  balance: {
      type: Number,
      default: 0
  }, 
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'User', 'Sales Rep', 'Reseller'],
    default: 'User',
  },
  toBalance: {
    type: Number,
    default: 0
  },
  businessName: {
    type: String
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED', 'BANNED'],
    default: 'ACTIVE',
  },
},{ timestamps: true } // Add timestamps (createdAt, updatedAt) to the documents
);

// Create the User model
const User = model<IUserDocument>('User', userSchema);

export default User;
export { IUserDocument };

