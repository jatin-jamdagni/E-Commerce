

import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequest, validateRegistrationData, verifyForgetPasswordOTP, verifyOTP } from "../utils/auth.helper";
import { prisma } from "@eshop/libs";
import { AuthenticationError, ValidationError } from "@eshop/error-middleware";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { setCookies } from "../utils/cookies/setCookies";



export const userRegistrationController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { name, email, password } = req.body;
    validateRegistrationData({ name, email, password }, "user");


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
      message: "Please check your email for the OTP.",
      success: true,
    })

  } catch (error) {
    next(error);
  }
}


export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {

  try {
    validateRegistrationData(req.body, "user");
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("Email, OTP, Password and Name are required!"))
    }
    const existingUser = await prisma.users.findUnique({
      where: { email }
    })
    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"))
    }

    await verifyOTP(email, otp, next)

    const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = await prisma.users.create({
    //   data: {
    //     email,
    //     password: hashedPassword,
    //     name
    //   }
    // })

    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,

      }
    })

    if (!newUser) {
      return next(new ValidationError("User registration failed!"))
    }
    res.status(201).json({
      message: "User registered successfully!",
      success: true,
    })

  } catch (error) {
    next(error);
  }
}


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("Email and Password are required!"))
    }
    const existingUser = await prisma.users.findUnique({
      where: { email }
    })
    if (!existingUser) {
      return next(new ValidationError("User not exists!"))
    }

    // if (!existingUser.password) {
    //   return next(new ValidationError("Password is missing for the user!"));
    // }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password!);
    if (!isPasswordValid) {
      return next(new AuthenticationError("Invalid password!"))
    }

    const accessToken = jwt.sign(
      {
        id: existingUser.id,
        role: "user",
      },
      process.env.ACCESS_TOKEN_SECRET || "defaultAccessSecret",
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: existingUser.id,
        role: "user",
      },
      process.env.REFRESH_TOKEN_SECRET || "defaultRefreshSecret",
      {
        expiresIn: "7d",
      }
    );

    setCookies(res, "refreshToken", refreshToken);

    setCookies(res, "accessToken", accessToken);


    res.status(200).json({
      message: "Login successful!",
      success: true,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      }
    })

  } catch (error) {
    next(error);
  }
}


export const userForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  handleForgotPassword(req, res, next, "user");
}

export const verifyUserForgetPassword = async (req: Request, res: Response, next: NextFunction) => {

  await verifyForgetPasswordOTP(req, res, next);

  }


export const userResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("Email and Password are required!"))
    }
    const existingUser = await prisma.users.findUnique({
      where: { email }
    })
    if (!existingUser) {
      return next(new ValidationError("User not exists!"))
    }

    const isSamePassword = await bcrypt.compare(password, existingUser.password!);
    if (isSamePassword) {
      return next(new ValidationError("New password cannot be same as old password!"))
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
      }
    })

    if (!updatedUser) {
      return next(new ValidationError("Password reset failed!"))
    }
    res.status(200).json({
      message: "Password reset successfully!",
      success: true,
    })

  } catch (error) {
    next(error);
  }
}
