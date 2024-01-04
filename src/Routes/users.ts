import { Router } from "express";
import { addUser, deleteUser, getUser, getUsers, signup, updateUser, verifyEmailToken } from "../Controlers/users";
import { checkToken } from "../middleware/auth";
const userRouter = Router();

//admin authentication
userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", addUser);
userRouter.post("/signup", signup);
userRouter.post("/verify-email", checkToken, verifyEmailToken);
userRouter.delete('/', deleteUser);
userRouter.patch('/:id', updateUser);

export default userRouter;