import { Router } from "express";
import { addUser, deleteUser, getUserdetails, getUsers, login, resendEmailToken, signup, updatePhoneno, updateUserInfo, userProfile, verifyEmailToken } from "../Controlers/users";
import { checkToken } from "../middleware/auth";
const userRouter = Router();

//admin authentication
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserdetails);
userRouter.post("/", addUser);
userRouter.post("/signup", signup);
userRouter.post("/verify-email", checkToken, verifyEmailToken);
userRouter.post("/resend-email-otp", checkToken, resendEmailToken)
userRouter.post('/login', login);
userRouter.delete('/', deleteUser);
userRouter.patch('/:id', updateUserInfo);
userRouter.get('/profile', checkToken, userProfile)
userRouter.get('/', checkToken, updatePhoneno)

export default userRouter;