import crypto from 'crypto';
import { ValidationError } from '@eshop/error-middleware';
import { prisma, redis } from '@eshop/libs';
import { sendEmail } from './sendMail';
import { NextFunction, Request, Response } from 'express';
export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
  const { email, password, name, phone_number, country } = data;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!email || !emailRegex.test(email)) {
    throw new ValidationError("Invalid email address");
  }
  // Removed redundant ValidationError class definition

  if (!password || !passwordRegex.test(password)) {
    throw new ValidationError("Password must be at least 8 characters long and contain at least one letter and one number");
  }

  if (!name) {
    throw new ValidationError("Name is required");
  }

  if (userType === "seller" && (!phone_number || !country)) {
    const { storeName, storeAddress } = data;

    if (!storeName) {
      throw new ValidationError("Store name is required for seller registration");
    }
    if (!storeAddress) {
      throw new ValidationError("Store address is required for seller registration");
    }
  }

  return null;
};

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {

  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("Account locked due to multiple failed attempts. Please try again after 30 minutes."));
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError("You have reached the maximum number of OTP requests. Please try again after 1 hour."));
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError("Please wait 1 minute before requesting another OTP."));
  }
}


// This function tracks the number of OTP requests made by a user
// It uses Redis to store the count and sets an expiration time of 1 hour
// If the user exceeds the limit of 2 requests, it locks the account for 1 hour

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;

  const otpRequests = parseInt(await redis.get(otpRequestKey) || "0");
  if (otpRequests >= 5) {
    await redis.set(`otp_spam_lock:${email}`, "true", 'EX', 3600);
    return next(new ValidationError("You have reached the maximum number of OTP requests. Please try again after 1 hour."));
  }
  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600);
}

// This function is used to send an OTP to the user's email address
// It generates a random 4-digit OTP and sends it using the sendEmail function
export const sendOtp = async (email: string, name: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", 'EX', 60);

}



export const verifyOTP = async (email: string, otp: string, next: NextFunction) => {

  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    return next(new ValidationError("OTP expired or Invalid"));
  }
  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt(await redis.get(failedAttemptsKey) || "0");

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "true", 'EX', 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      return next(new ValidationError("Account locked due to multiple failed attempts. Please try again after 30 minutes."));
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300);
    return next(new ValidationError(`Invalid OTP. ${2 - failedAttempts} attempts left`));
  }
  await redis.del(`otp:${email}`, failedAttemptsKey);
}

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction, userType: "user" | "seller"
) => {

  try {

    const { email } = req.body;
    if (!email) {
      return next(new ValidationError("Email is required"));
    }
    const user = userType === "user" && await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      return next(new ValidationError(`${userType} not found`));
    }

    checkOtpRestrictions(email, next);
    trackOtpRequest(email, next);
    sendOtp(email, user.name, "forgot-password-user-mail");

    res.status(200).json({
      message: "OTP sent to email. Please verify to reset password",
      success: true,
    });

  } catch (error) {
    next(error);
  }
}
