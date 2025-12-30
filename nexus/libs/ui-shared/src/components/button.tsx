import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => {
  const baseStyles = "px-6 py-2 rounded font-medium transition-all active:scale-95 cursor-pointer";
  
  // Use 'ms' (margin-start) instead of 'ml' (margin-left)
  // Use 'pe' (padding-end) instead of 'pr' (padding-right)
  const logicalStyles = "ms-2 me-2"; 

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${logicalStyles} ${className}`} 
      {...props} 
    />
  );
};