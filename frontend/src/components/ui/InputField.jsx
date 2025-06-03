import React from 'react';
import { useFormContext, Controller } from 'react-hook-form'; 

function InputField({ name, label, type = 'text', placeholder = '', error, ...props }) {

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
        {label}:
      </label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'focus:border-blue-500 focus:ring-blue-200'
        }`}
        {...props} 
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
}

export default InputField;