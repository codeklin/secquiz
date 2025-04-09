import React from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface BasicSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function BasicSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
  ...props
}: BasicSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
