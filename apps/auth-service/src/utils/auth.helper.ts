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
  try {
    const [otpLock, spamLock, cooldown] = await Promise.all([
      redis.get(`otp_lock:${email}`),
      redis.get(`otp_spam_lock:${email}`),
      redis.get(`otp_cooldown:${email}`)
    ]);

    if (otpLock) {
      return next(new ValidationError("Account locked due to multiple failed attempts. Please try again after 30 minutes."));
    }

    if (spamLock) {
      return next(new ValidationError("You have reached the maximum number of OTP requests. Please try again after 1 hour."));
    }

    if (cooldown) {
      return next(new ValidationError("Please wait 1 minute before requesting another OTP."));
    }
  } catch (error) {
    console.error('Redis error in checkOtpRestrictions:', error);
    return next(new ValidationError("Service temporarily unavailable. Please try again later."));
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  try {
    const otpRequestKey = `otp_request_count:${email}`;
    const otpRequests = parseInt(await redis.get(otpRequestKey) || "0");

    if (otpRequests >= 5) {
      await redis.set(`otp_spam_lock:${email}`, "true", 'EX', 3600);
      return next(new ValidationError("You have reached the maximum number of OTP requests. Please try again after 1 hour."));
    }

    await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600);
  } catch (error) {
    console.error('Redis error in trackOtpRequest:', error);
    return next(new ValidationError("Service temporarily unavailable. Please try again later."));
  }
};

export const sendOtp = async (email: string, name: string, template: string) => {
  try {
    const otp = crypto.randomInt(1000, 9999).toString();

    await sendEmail(email, "Verify Your Email", template, { name, otp });

    // Use pipeline for better performance
    const pipeline = redis.pipeline();
    pipeline.set(`otp:${email}`, otp, "EX", 300);
    pipeline.set(`otp_cooldown:${email}`, "true", 'EX', 60);
    await pipeline.exec();

    return otp; // Return for testing purposes if needed
  } catch (error) {
    console.error('Error in sendOtp:', error);
    throw new Error("Failed to send OTP. Please try again later.");
  }
};

export const verifyOTP = async (email: string, otp: string, next: NextFunction) => {
  try {
    const [storedOtp, failedAttemptsStr] = await Promise.all([
      redis.get(`otp:${email}`),
      redis.get(`otp_attempts:${email}`)
    ]);

    if (!storedOtp) {
      return next(new ValidationError("OTP expired or invalid"));
    }

    const failedAttempts = parseInt(failedAttemptsStr || "0");

    if (storedOtp !== otp) {
      if (failedAttempts >= 2) {
        // Use pipeline for atomic operations
        const pipeline = redis.pipeline();
        pipeline.set(`otp_lock:${email}`, "true", 'EX', 1800);
        pipeline.del(`otp:${email}`, `otp_attempts:${email}`);
        await pipeline.exec();

        return next(new ValidationError("Account locked due to multiple failed attempts. Please try again after 30 minutes."));
      }

      await redis.set(`otp_attempts:${email}`, failedAttempts + 1, 'EX', 300);
      return next(new ValidationError(`Invalid OTP. ${2 - failedAttempts} attempts left`));
    }

    // Success - clean up
    await redis.del(`otp:${email}`, `otp_attempts:${email}`);
  } catch (error) {
    console.error('Redis error in verifyOTP:', error);
    return next(new ValidationError("Service temporarily unavailable. Please try again later."));
  }
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ValidationError("Email is required"));
    }

    // Fix the user lookup logic
    const user = userType === "user"
      && await prisma.users.findUnique({ where: { email } })
    // : await prisma.sellers.findUnique({ where: { email } }); // Assuming you have a sellers table

    if (!user) {
      return next(new ValidationError(`${userType} not found`));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, user.name, "forgot-password-user-mail");

    res.status(200).json({
      message: "OTP sent to email. Please verify to reset password",
      success: true,
    });

  } catch (error) {
    next(error);
  }
};

export const verifyForgetPasswordOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new ValidationError("Email and OTP are required"));
    }

    await verifyOTP(email, otp, next);

    res.status(200).json({
      message: "OTP verified successfully, you can now reset your password",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
