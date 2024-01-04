
import { IUser } from "../Models/types";
import User, { IUserDocument } from "../Models/users";

const addUser = async (user: IUser): Promise<IUserDocument> => {
  try {
    const newUser = new User(user);
    return await newUser.save();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

const getUsers = async (): Promise<IUserDocument[]> => {
  try {
    return await User.find();
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

const getUserByid = async (id: string): Promise<IUserDocument | null> => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error(`Error getting user with ID ${id}:`, error);
    throw error;
  }
};

export const getUser = async (where: any): Promise<IUserDocument | null> =>{
  return await User.findOne({where})
}

 const updateUserById = async (id: string, updatedUser: any): Promise<IUserDocument | null> => {
  try {
    return await User.findByIdAndUpdate(id, updatedUser, { new: true });
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (whereFields: any, newDetails: any): Promise<IUserDocument | null> =>{
  try {
    return await User.findOneAndUpdate(whereFields, newDetails, {new: true});
  } catch (error) {
    console.error(`Error updating user`, error);
    throw error;
  }
}

const checkIfExist = async (whereField: any): Promise<boolean | null> =>{
  return User.findOne({whereField});
}

//delete user from database
const deleteUser = async (id: string) => {
  try {
    const deleteUser =  await User.findByIdAndDelete(id);
    if (!deleteUser) {
        return false;
    }
    return true;

  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
}

// export default {
//   updateUser, checkIfExist
// }

