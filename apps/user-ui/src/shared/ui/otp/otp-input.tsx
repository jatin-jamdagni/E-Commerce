'use client';

import React, { useRef, useEffect } from 'react';

type OtpInputProps = {
  length?: number;
  onSubmit?: (otp: string) => void;
  value?: string;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoSubmit?: boolean; // New prop to control auto-submission
};

const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  onSubmit,
  value = '',
  autoFocus = false,
  className = '',
  inputClassName = '',
  disabled = false,
  autoSubmit = false, // Default to false for manual submission
}) => {
  const [otp, setOtp] = React.useState<string[]>(
    value ? value.split('').slice(0, length) : new Array(length).fill(''),
  );

  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const val = value.split('').slice(0, length);
      setOtp([...val, ...new Array(length - val.length).fill('')]);
    }
  }, [value, length]);

  // Only auto-submit if autoSubmit prop is true
  useEffect(() => {
    if (autoSubmit) {
      const isComplete =
        otp.length === length && otp.every((digit) => digit !== '');
      if (isComplete && onSubmit) {
        onSubmit(otp.join(''));
      }
    }
  }, [otp, length, onSubmit, autoSubmit]);

  const handleChange = (text: string, index: number) => {
    if (/[^0-9]/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData('Text')
      .replace(/\D/g, '')
      .slice(0, length);

    const newOtp = [...new Array(length).fill('')];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }

    setOtp(newOtp);

    // Focus on the next empty input or the last one
    const focusIndex = Math.min(pasteData.length, length - 1);
    inputRef.current[focusIndex]?.focus();
  };

  const handleSubmit = () => {
    const otpValue = otp.join('');
    if (onSubmit && otpValue.length === length) {
      onSubmit(otpValue);
    }
  };

  // Check if OTP is complete for button state
  const isOtpComplete = otp.length === length && otp.every((digit) => digit !== '');

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className={`flex gap-2`}>
        {otp.map((digit, index) => (
          <input
            type="text"
            key={index}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            ref={(el) => {
              inputRef.current[index] = el;
            }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            autoFocus={autoFocus && index === 0}
            className={`w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${inputClassName}`}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled || !isOtpComplete}
        className={`py-2 border mt-4 text-center border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${
          disabled || !isOtpComplete
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Submit OTP
      </button>
    </div>
  );
};

export default OtpInput;
