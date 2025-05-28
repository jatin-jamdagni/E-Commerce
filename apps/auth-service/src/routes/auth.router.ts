import express, { Router } from "express";
import { loginUser, userForgetPassword, userRegistrationController, userResetPassword, verifyUser } from "../controller/auth.controller";
import { verifyForgetPasswordOTP } from "../utils/auth.helper";


const router: Router = express.Router();


router.post("/user-registeration", userRegistrationController);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/forgot-password-user",userForgetPassword )
router.post("/reset-password-user",userResetPassword )
router.post("/verify-forgot-password-user",verifyForgetPasswordOTP )





export default router;
