import { Router } from "express";
import { addUser, deleteUser, getUser, getUsers, signup, updateUser } from "../Controlers/users";
const userRouter = Router();

//admin authentication
userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", addUser);
userRouter.post("/signup", signup);
userRouter.delete('/', deleteUser);
userRouter.patch('/:id', updateUser);

export default userRouter;