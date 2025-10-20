"use client"
import * as React from 'react'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full h-9 px-3 rounded-md bg-transparent border border-gray-600 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...props}
    />
  ),
)
Input.displayName = 'Input'


