'use client';

import OtpInput from '@/shared/ui/otp/otp-input';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type EmailFormData = {
  email: string;
};

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

type ForgotPasswordStep = 'email' | 'otp' | 'reset';

const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [timer, setTimer] = useState(60);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startResendTimer = useCallback(() => {
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

  // Email form
  const emailForm = useForm<EmailFormData>({
    defaultValues: { email: '' },
  });

  // Reset password form
  const resetForm = useForm<ResetPasswordFormData>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  // Send forgot password email
  const sendEmailMutation = useMutation({
    mutationFn: async (data: EmailFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        data,
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setEmail(formData.email);
      setCurrentStep('otp');
      setServerError(null);
      setSuccessMessage('Reset code sent to your email address');
      startResendTimer();
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.message ||
          'Failed to send reset email. Please try again.',
      );
    },
  });

  // Verify OTP
  const verifyOTPMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        { email, otp },
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        setServerError('No reset token received. Please try again.');
        return;
      }
      // setResetToken(data.resetToken);
      setCurrentStep('reset');
      setServerError(null);
      setSuccessMessage('Code verified successfully');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.message ||
          'Invalid or expired code. Please try again.',
      );
    },
  });

  // Reset password
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        {
          email,
          password: data.password,
          // resetToken,
        },
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      setSuccessMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.message ||
          'Failed to reset password. Please try again.',
      );
    },
  });

  const handleEmailSubmit = useCallback(
    (data: EmailFormData) => {
      sendEmailMutation.mutate(data);
    },
    [sendEmailMutation],
  );

  const handleOTPVerify = useCallback(
    (otp: string) => {
      verifyOTPMutation.mutate(otp);
    },
    [verifyOTPMutation],
  );

  const handlePasswordReset = useCallback(
    (data: ResetPasswordFormData) => {
      if (data.password !== data.confirmPassword) {
        setServerError('Passwords do not match');
        return;
      }
      resetPasswordMutation.mutate(data);
    },
    [resetPasswordMutation],
  );

  const handleResendOTP = useCallback(() => {
    if (canResendOTP && email) {
      sendEmailMutation.mutate({ email });
    }
  }, [canResendOTP, email, sendEmailMutation]);

  const handleBackToEmail = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentStep('email');
    setServerError(null);
    setSuccessMessage(null);
    setTimer(60);
    setCanResendOTP(false);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  return (
    <div className="w-full py-16 min-h-[85vh] bg-gray-50">
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          {/* Email Step */}
          {currentStep === 'email' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Forgot Password
                </h2>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a code to reset
                  your password.
                </p>
              </div>

              {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 text-sm">{successMessage}</p>
                </div>
              )}

              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      {...emailForm.register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        emailForm.formState.errors.email
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={sendEmailMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {sendEmailMutation.isPending
                    ? 'Sending...'
                    : 'Send Reset Code'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {/* OTP Verification Step */}
          {currentStep === 'otp' && (
            <div className="text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Code
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter the verification code sent to{' '}
                <span className="font-medium">{email}</span>
              </p>

              {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 text-sm">{successMessage}</p>
                </div>
              )}

              <OtpInput
                length={4}
                onSubmit={handleOTPVerify}
                autoFocus
                className="mb-4"
                autoSubmit={false}
                disabled={verifyOTPMutation.isPending}
              />

              <p className="text-sm text-gray-500 mb-4">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  disabled={!canResendOTP || sendEmailMutation.isPending}
                  className={`${
                    canResendOTP && !sendEmailMutation.isPending
                      ? 'text-blue-600 hover:underline'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {sendEmailMutation.isPending
                    ? 'Sending...'
                    : canResendOTP
                      ? 'Resend'
                      : `Resend in ${formatTime(timer)}`}
                </button>
              </p>

              <button
                onClick={handleBackToEmail}
                className="text-sm text-blue-500 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft size={16} />
                Back to Email
              </button>
            </div>
          )}

          {/* Reset Password Step */}
          {currentStep === 'reset' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">Enter your new password below.</p>
              </div>

              {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 text-sm">{successMessage}</p>
                </div>
              )}

              <form
                onSubmit={resetForm.handleSubmit(handlePasswordReset)}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      type={passwordVisible ? 'text' : 'password'}
                      {...resetForm.register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        resetForm.formState.errors.password
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
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
                  {resetForm.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {resetForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      {...resetForm.register('confirmPassword', {
                        required: 'Please confirm your password',
                      })}
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        resetForm.formState.errors.confirmPassword
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {confirmPasswordVisible ? (
                        <EyeOff className="text-gray-400" />
                      ) : (
                        <Eye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {resetPasswordMutation.isPending
                    ? 'Resetting...'
                    : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
