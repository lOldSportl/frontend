import React from 'react';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ label, error, className = '', ...rest }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-medium mb-1">{label}</label>
      <input
        {...rest}
        className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-[#474747] dark:text-white dark:border-gray-600"
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default Field;
