import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Reusable Button component with consistent styling
 * @param {string} variant - Button variant: 'primary', 'secondary', 'danger', 'success', 'outline'
 * @param {string} size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} fullWidth - Whether the button should take full width
 * @param {boolean} loading - Whether to show loading state
 * @param {string} loadingText - Text to show when loading
 * @param {string} type - Button type (submit, button, reset)
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Whether the button is disabled
 * @param {ReactNode} children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  loadingText = 'Processing...',
  type = 'button',
  onClick,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 hover:scale-105',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 hover:scale-105',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 hover:scale-105',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 hover:scale-105',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = (disabled || loading) ? 'opacity-70 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" color={variant === 'outline' ? 'primary' : 'white'} />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      ) : children}
    </button>
  );
};

export default Button;
