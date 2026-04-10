import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthCenteredLayout } from './AuthCenteredLayout';
import { AuthInput } from './AuthInput';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export function ResetPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Password successfully reset');
    toast.success('Password successfully reset!');
    navigate('/password-reset-success');
  };

  return (
    <AuthCenteredLayout>
      <div className="flex flex-col items-center">
        {/* Top Icon Area */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="w-[80px] h-[80px] rounded-full bg-[#1f2220] border-[3px] border-[#005b55] flex items-center justify-center relative shadow-[0_0_30px_rgba(16,185,129,0.1)]">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
               <path d="M24 24H20.1561C18.3299 23.5651 16.6308 22.8023 15.1241 21.777C14.7469 21.5213 14.382 21.2481 14.0305 20.9599C14.1139 20.7679 14.1939 20.5743 14.2695 20.3784C14.6534 19.3889 14.9372 18.3496 15.1079 17.2723C15.1135 17.2796 15.1185 17.2863 15.1241 17.293C16.3151 18.8371 18.0316 19.9548 20.0062 20.3784C20.1131 20.4019 20.2205 20.4226 20.3291 20.4411C20.3257 20.4204 20.3213 20.3991 20.3168 20.3784H20.3789V13.6462H15.1241V10.3342H24V24Z" fill="#F5F5F5" />
               <path d="M10.3182 3.62158C10.1094 3.42849 9.89506 3.24212 9.67455 3.06247C8.02407 1.71704 6.05345 0.750507 3.89422 0.294942C2.97971 0.101859 2.03162 0 1.06003 0H0V12.2924C0.00335805 12.2952 0.00615643 12.2975 0.00951448 12.2997V13.6462H10.3439V3.64508C10.3355 3.63669 10.3266 3.62885 10.3182 3.62158ZM3.6211 10.3342V3.62158H3.80915C3.84217 3.62885 3.87519 3.63669 3.90821 3.64452C5.81111 4.10009 7.46159 5.20318 8.61508 6.70755C9.25871 7.54705 9.74675 8.51135 10.0378 9.55791C10.0876 9.73757 10.1318 9.91946 10.1699 10.1036C10.1855 10.1803 10.2006 10.2569 10.2146 10.3342H3.6211Z" fill="#F5F5F5" />
               <path d="M10.3439 0V13.6462H3.85672C3.77725 13.7324 3.69889 13.8203 3.6211 13.9087C3.54051 14.0005 3.46103 14.0934 3.38324 14.1874C1.97398 15.8743 0.922345 17.87 0.343641 20.0577H0.343081C0.198685 20.604 0.0833916 21.1625 0 21.7311V24H12.2614C12.2664 23.9933 12.2714 23.9866 12.2765 23.9799H13.6561V3.62158H20.3616C20.3431 3.71504 20.3224 3.80738 20.3005 3.89917C19.8181 5.91283 18.6109 7.64387 16.9699 8.80181C16.4024 9.20253 15.7834 9.53441 15.1241 9.7857V10.3342H20.3593C20.366 10.3274 20.3727 10.3202 20.3789 10.3129C20.5345 10.1433 20.6856 9.97039 20.8334 9.79353C22.2197 8.13301 23.2607 6.17364 23.8455 4.02621C23.9009 3.82137 23.953 3.6143 24 3.40555V0H10.3439ZM10.3439 20.3784H3.85113C3.87855 20.2413 3.90933 20.1059 3.94347 19.9716C4.4427 18.0049 5.63537 16.3153 7.24668 15.1786C7.86232 14.7437 8.53953 14.39 9.26207 14.1326C9.53071 14.0363 9.80551 13.9541 10.0859 13.8852H10.0865C10.0954 13.883 10.1044 13.8807 10.1133 13.8785C10.1895 13.8606 10.2667 13.8432 10.3439 13.827V20.3784Z" fill="#F5F5F5" />
             </svg>
          </div>
          <div className="text-center">
            <h1 className="text-[24px] font-medium text-white mb-1 font-['Inter_Tight']">Reset your password</h1>
            <p className="text-[16px] text-[#717784] max-w-[350px] font-['Inter_Tight'] leading-[24px]">
              Create a new password to secure your account.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
          <AuthInput
            label="Reset password"
            type="password"
            placeholder="Enter new password"
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
            error={errors.password?.message}
          />

          <AuthInput
            label="Confirm password"
            type="password"
            placeholder="Confirm new password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[48px] text-[16px] font-semibold shadow-[0_4px_12px_rgba(6,95,70,0.25)]"
          >
            {isSubmitting ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>
      </div>
    </AuthCenteredLayout>
  );
}
