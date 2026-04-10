import React from 'react';

interface SocialAuthButtonProps {
  provider: 'google' | 'x' | 'facebook';
  onClick?: () => void;
}

const providers = {
  google: {
    label: 'Google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
    ),
  },
  x: {
    label: 'X',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
        <path d="M12.6 1h2.454l-5.36 6.13L16 15h-4.937l-3.867-5.059L2.76 15H.303l5.733-6.555L0 1h5.063l3.495 4.623L12.601 1zm-.86 12.574h1.36L4.323 2.39H2.865l8.875 11.184z"/>
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="#1877F2">
        <path d="M18 9a9 9 0 1 0-10.406 8.892V11.61H5.31V9h2.284V7.017c0-2.254 1.343-3.5 3.4-3.5.984 0 2.014.176 2.014.176v2.213h-1.135c-1.118 0-1.466.694-1.466 1.406V9h2.496l-.399 2.61H10.41v6.281A9.003 9.003 0 0 0 18 9z"/>
      </svg>
    ),
  },
};

export function SocialAuthButton({ provider, onClick }: SocialAuthButtonProps) {
  const { icon } = providers[provider];
  return (
    <button
      type="button"
      onClick={onClick}
      className="size-[44px] rounded-[10px] bg-[#111314] border border-[#2E2F33] flex items-center justify-center hover:bg-[#1a1b1f] hover:border-[#3E3F43] transition-all"
      aria-label={`Continue with ${providers[provider].label}`}
    >
      {icon}
    </button>
  );
}
