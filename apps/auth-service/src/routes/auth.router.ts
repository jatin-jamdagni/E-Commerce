import express, { Router } from "express";
import { userRegistrationController } from "../controller/auth.controller";


const router: Router = express.Router();


router.post("/user-registeration", userRegistrationController);


export default router;
