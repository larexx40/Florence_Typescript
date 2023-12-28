
import User, { IUserDocument } from "../Models/users";

export const addUser = async (user: any): Promise<IUserDocument> => {
  try {
    const newUser = new User(user);
    return await newUser.save();
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<IUserDocument[]> => {
  try {
    return await User.find();
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const getUser = async (id: string): Promise<IUserDocument | null> => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error(`Error getting user with ID ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (id: string, updatedUser: any): Promise<IUserDocument | null> => {
  try {
    return await User.findByIdAndUpdate(id, updatedUser, { new: true });
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

//delete user from database
export const deleteUser = async (id: string) => {
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

