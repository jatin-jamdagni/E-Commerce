'use client';

import GoogleButton from '@/shared/ui/Buttons/google-button';
import OtpInput from '@/shared/ui/otp/otp-input';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Mail, Lock, User2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(60);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startResendTimer = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCanResendOTP(false);
    setTimer(60);

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer - 1;
        if (newTimer <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setCanResendOTP(true);
          return 0;
        }
        return newTimer;
      });
    }, 1000);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registeration`,
        data,
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setServerError(null); // Clear any previous errors
      startResendTimer();
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.message ||
          'Registration failed. Please try again.',
      );
    },
  });

  const verifyOTP = useMutation({
    mutationFn: async (otp: string) => {
      if (!userData) throw new Error('User data not found');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,
        { ...userData, otp },
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: () => {
      // Clear the timer when verification is successful
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      router.push('/login');
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.message ||
          'OTP verification failed. Please try again.',
      );
    },
  });

  const handleVerify = useCallback(
    (otp: string) => {
      verifyOTP.mutate(otp);
    },
    [verifyOTP],
  );

  const handleGoogleSignUp = useCallback(async () => {
    try {
      console.log('Google sign-up initiated');
      // Integrate Google OAuth here
    } catch (err: any) {
      setServerError('Google sign-up failed. Please try again.');
      console.error('Google Auth Error: ', err?.message);
    }
  }, []);

  const handleResend = useCallback(() => {
    if (canResendOTP && userData) {
      console.log('Resending OTP for:', userData.email);
      setServerError(null); // Clear any previous errors
      startResendTimer();
      // Add resend logic if needed
    }
  }, [canResendOTP, userData, startResendTimer]);

  const handleBackToSignUp = useCallback(() => {
    // Clear the timer when going back
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setShowOtp(false);
    setServerError(null);
    setTimer(60);
    setCanResendOTP(false);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  return (
    <div className="w-full py-16 min-h-[85vh] bg-gray-50">
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          {!showOtp ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              <div className="mb-6">
                <GoogleButton onClick={handleGoogleSignUp} />
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form
                onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
                className="space-y-4"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="name"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 3,
                          message: 'Name must be at least 3 characters',
                        },
                      })}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      type={passwordVisible ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <EyeOff className="text-gray-400" />
                      ) : (
                        <Eye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center flex flex-col items-center">
              <h1 className="text-xl font-bold mb-2">Verify OTP</h1>
              <p className="text-sm text-gray-600 mb-4">
                Enter the code sent to{' '}
                <span className="font-medium">{userData?.email}</span>
              </p>

              {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              <OtpInput
                length={4}
                onSubmit={handleVerify}
                autoFocus
                className="mb-4"
              />

              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={!canResendOTP}
                  className={`${canResendOTP ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                >
                  {canResendOTP ? 'Resend' : `Resend in ${formatTime(timer)}`}
                </button>
              </p>

              <button
                onClick={handleBackToSignUp}
                className="mt-4 text-sm text-blue-500 hover:underline"
              >
                ← Back to Sign Up
              </button>
            </div>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{' '}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
