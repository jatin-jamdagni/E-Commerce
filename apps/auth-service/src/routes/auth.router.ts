import express, { Router } from "express";
import { loginUser, userRegistrationController, verifyUser } from "../controller/auth.controller";


const router: Router = express.Router();


router.post("/user-registeration", userRegistrationController);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);




export default router;
