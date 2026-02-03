import React from 'react';

interface InputTextboxProps {
  label: string;
  labelText: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { email?: string; password?: string };
  isLoading: boolean;
}

const InputTextbox  = ({label,labelText,type,value,onChange,errors,isLoading}: InputTextboxProps) => {
  return (
    <div>
        <label htmlFor={label} className="block text-sm font-semibold text-gray-700 mb-2">
        {labelText}
        </label>
        <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border-2 ${
            errors.email ? 'border-red-500' : 'border-gray-200'
        } focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200`}
        placeholder="you@example.com"
        disabled={isLoading}
        />
        {errors.email && (
        <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
        )}
    </div>
  )
}

export default InputTextbox