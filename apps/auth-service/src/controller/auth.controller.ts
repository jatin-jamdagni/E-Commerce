

// Register the controller

import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequest, validateRegistrationData } from "../utils/auth.helper";
import { prisma } from "@eshop/libs";
import { ValidationError } from "@eshop/error-middleware";

export const userRegistrationController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;


    const existingUser = await prisma.users.findUnique({
      where: { email }
    })

    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"))
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, name, "user-activation-mail");

    res.status(200).json({
      message: "Registration successful! Please check your email for the OTP.",

    })

  } catch (error) {
    next(error);
  }


}
