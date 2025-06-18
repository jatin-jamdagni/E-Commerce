import express, { Router } from "express";
import { loginUser, refreshToken, userForgetPassword, userRegistrationController, userResetPassword, verifyUser, verifyUserForgetPassword } from "../controller/auth.controller";


const router: Router = express.Router();


router.post("/user-registeration", userRegistrationController);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken)
router.post("/forgot-password-user",userForgetPassword )
router.post("/reset-password-user",userResetPassword )
router.post("/verify-forgot-password-user",verifyUserForgetPassword )





export default router;
