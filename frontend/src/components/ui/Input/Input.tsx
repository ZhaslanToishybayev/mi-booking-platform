import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/70 mb-2 font-body">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            input-glass
            ${error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : ''}
            ${className}
          `}
          data-testid="input"
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400 font-body" data-testid="input-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea component for multiline input
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/70 mb-2 font-body">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            input-glass resize-none
            ${error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : ''}
            ${className}
          `}
          data-testid="textarea"
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400 font-body" data-testid="textarea-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/70 mb-2 font-body">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            input-glass cursor-pointer
            ${error ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20' : ''}
            ${className}
          `}
          data-testid="select"
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-dark-800 text-white">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-sm text-red-400 font-body" data-testid="select-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
