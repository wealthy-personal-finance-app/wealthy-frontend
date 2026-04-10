import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface AuthInputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  registration: Record<string, any>; // react-hook-form register return
}

export function AuthInput({
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  error,
  registration,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[#99A0AE] text-[14px] font-medium font-['Inter',sans-serif]">{label}</label>
      <div className="relative">
        <input
          {...registration}
          type={inputType}
          placeholder={placeholder}
          className={`w-full h-[46px] bg-[#111314] border rounded-[10px] px-[14px] text-white text-[14px] font-['Inter',sans-serif] placeholder:text-[#4B5162] outline-none transition-all
            ${error ? 'border-red-500 focus:border-red-400' : 'border-[#2E2F33] focus:border-[#10B981]'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#4B5162] hover:text-[#99A0AE] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-[12px] font-['Inter',sans-serif]">{error}</p>
      )}
    </div>
  );
}
