'use client';

import type * as React from 'react';

interface GoogleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  loading?: boolean;
  variant?: 'default' | 'outline';
  loadingTitle?: string
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  onClick,
  loading = false,
  variant = 'default',
  disabled,
  className = '',
  title  = 'Sign in with google',
  loadingTitle="loading",
  ...props
}) => {
  const baseStyles =
    'w-full h-[46px] flex items-center justify-center gap-3 px-4 rounded-md font-medium text-gray-700 transition-all duration-200 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    default:
      'bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm',
    outline:
      'bg-white border border-blue-100 hover:bg-blue-50 hover:border-blue-200 shadow-sm',
  };

  return (
    <div className="w-full flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        aria-label="Sign in with Google"
        {...props}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="flex-shrink-0"
          >
            <path
              fill="#4285F4"
              d="M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 01-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15z"
            />
            <path
              fill="#34A853"
              d="M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.044 7.044 0 008.14 15z"
            />
            <path
              fill="#FBBC04"
              d="M4.187 9.342a4.17 4.17 0 010-2.68V4.859H1.849a6.97 6.97 0 000 6.286l2.338-1.803z"
            />
            <path
              fill="#EA4335"
              d="M8.14 3.77a3.837 3.837 0 012.7 1.05l2.01-1.999a6.786 6.786 0 00-4.71-1.82 7.042 7.042 0 00-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z"
            />
          </svg>
        )}

        <span className="text-sm font-medium">
          {loading ? loadingTitle : title}
        </span>
      </button>
    </div>
  );
};

export default GoogleButton;
