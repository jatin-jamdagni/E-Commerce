import { Request, Response, NextFunction } from "express";
import { prisma } from "@eshop/libs";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyForgetPasswordOTP,
  verifyOTP
} from "../utils/auth.helper";
import { AuthenticationError, ValidationError } from "@eshop/error-middleware";
import { setCookies } from "../utils/cookies/setCookies";
export const userRegistrationController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    validateRegistrationData({ name, email, password }, "user");

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, name, "user-activation-mail");

    return res.status(200).json({
      success: true,
      message: "Please check your email for the OTP."
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, otp, password, name } = req.body;
    validateRegistrationData({ email, password, name }, "user");

    if (!email || !otp || !password || !name) {
      return next(new ValidationError("Email, OTP, Password and Name are required!"));
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }

    await verifyOTP(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: { name, email, password: hashedPassword }
    });

    if (!newUser) {
      return next(new ValidationError("User registration failed!"));
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully!"
    });

  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and Password are required!"));
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (!existingUser) {
      return next(new ValidationError("User does not exist!"));
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password!);

    if (!isPasswordValid) {
      return next(new AuthenticationError("Invalid password!"));
    }

    const accessToken = jwt.sign(
      { id: existingUser.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET || "defaultAccessSecret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: existingUser.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET || "defaultRefreshSecret",
      { expiresIn: "7d" }
    );

    setCookies(res, "refreshToken", refreshToken);
    setCookies(res, "accessToken", accessToken);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {

    const refreshToken = await req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ValidationError('Unauthorized! No refresh token.')
    }

    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string, role: "user" | "seller" };
    if (!decode || !decode.id || !decode.role) {
      return new JsonWebTokenError("Forbidden! Invalid refresh token.")
    }

    // if(decode.role === "user"){
    const user = await prisma.users.findUnique({ where: { id: decode.id } });
    if (!user) {
      return new AuthenticationError("Forbidden: User/Seller not found!");
    }
    //  }

    const newAccessToken = jwt.sign({
      id: decode.id, role: decode.role
    },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m"
      }
    )

    setCookies(res, "accessToken", newAccessToken);

    return res.status(201).json({
      success: true
    })

  } catch (err) {
    next(err)
  }
};


export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  try {

    const user = (req as any).user;


    if(!user){
      return new AuthenticationError("User not avaiable please reverify it ")
    }

    res.send(401).json({
      message: "this is form the use get api where i don "
    })
  } catch (err) {
    next(err)
  }


}

export const userForgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return handleForgotPassword(req, res, next, "user");
};

export const verifyUserForgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return verifyForgetPasswordOTP(req, res, next);
};

export const userResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and Password are required!"));
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (!existingUser) {
      return next(new ValidationError("User does not exist!"));
    }

    const isSamePassword = await bcrypt.compare(password, existingUser.password!);

    if (isSamePassword) {
      return next(new ValidationError("New password cannot be the same as old password!"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully!"
    });

  } catch (error) {
    next(error);
  }
};
