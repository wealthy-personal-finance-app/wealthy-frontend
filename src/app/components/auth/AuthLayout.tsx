import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-[#0D0E11] overflow-hidden" style={{ fontFamily: 'Inter, Inter Tight, sans-serif' }}>
      
      {/* ── Left Panel (Branding & Preview) ── */}
      <div
        className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between"
        style={{
          background: 'linear-gradient(90deg, rgba(0, 91, 85, 0.35) 38.07%, rgba(40, 252, 174, 0.35) 100%), #081C18',
        }}
      >
        {/* Central Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 65%)', filter: 'blur(80px)' }} />

        {/* Content Container (Centered vertically) */}
        <div className="flex-1 flex flex-col items-center justify-center px-[60px] relative z-10 text-center">
          {/* App preview image - High Fidelity card */}
          <div 
            className="overflow-hidden mb-[60px] w-full max-w-[564px] rounded-[16px] shadow-[0_24px_48px_rgba(0,0,0,0.5)] border border-white/5"
            style={{
              aspectRatio: '564.25 / 401.244',
              background: 'url(/auth-app-preview.png) center / cover no-repeat',
            }}
          />

          {/* Text content from the specific screen context */}
          <h2 className="mb-[16px]"
            style={{ 
              color: 'var(--text-white-0, #FFF)',
              fontSize: '48px', 
              fontWeight: 500, 
              lineHeight: '60px', 
              fontFamily: 'Inter Tight, sans-serif',
              textAlign: 'center'
            }}>
            {title}
          </h2>
          <p className="max-w-[420px]" 
            style={{ 
              color: 'var(--text-sub-500, #717784)',
              fontSize: '14px', 
              fontWeight: 500, 
              lineHeight: '18px', 
              fontFamily: 'Inter Tight, sans-serif',
              textAlign: 'center'
            }}>
            {subtitle}
          </p>
        </div>

        {/* Branding Footer */}
        <div className="px-[48px] pb-[32px] flex justify-between items-center relative z-10 w-full">
          <span style={{ color: '#4A6B61', fontSize: '13px', fontWeight: 500 }}>© 2026 Wealthy</span>
          <div className="flex gap-[24px]">
            <a href="#" style={{ color: '#4A6B61', fontSize: '13px', fontWeight: 500 }} className="hover:text-white transition-all">Privacy Policy</a>
            <a href="#" style={{ color: '#4A6B61', fontSize: '13px', fontWeight: 500 }} className="hover:text-white transition-all">Terms of Use</a>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Interactive Content) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-[40px] py-[48px] bg-[#0D0E11] overflow-y-auto">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          
          {/* Top Wealthy Logo Header */}
          <div className="flex items-center gap-[12px] mb-[44px]">
            <div className="w-[44px] h-[44px] rounded-[10px] bg-[#064e3b] flex items-center justify-center shadow-[0_4px_20px_rgba(6,78,59,0.3)] relative overflow-hidden">
               {/* High-fidelity Logo SVG with inner glow filters */}
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="relative z-10">
                 <g filter="url(#logoFilter1_layout)">
                   <path d="M24 24H20.1561C18.3299 23.5651 16.6308 22.8023 15.1241 21.777C14.7469 21.5213 14.382 21.2481 14.0305 20.9599C14.1139 20.7679 14.1939 20.5743 14.2695 20.3784C14.6534 19.3889 14.9372 18.3496 15.1079 17.2723C15.1135 17.2796 15.1185 17.2863 15.1241 17.293C16.3151 18.8371 18.0316 19.9548 20.0062 20.3784C20.1131 20.4019 20.2205 20.4226 20.3291 20.4411C20.3257 20.4204 20.3213 20.3991 20.3168 20.3784H20.3789V13.6462H15.1241V10.3342H24V24Z" fill="#F5F5F5" />
                 </g>
                 <g filter="url(#logoFilter2_layout)">
                   <path d="M10.3182 3.62158C10.1094 3.42849 9.89506 3.24212 9.67455 3.06247C8.02407 1.71704 6.05345 0.750507 3.89422 0.294942C2.97971 0.101859 2.03162 0 1.06003 0H0V12.2924C0.00335805 12.2952 0.00615643 12.2975 0.00951448 12.2997V13.6462H10.3439V3.64508C10.3355 3.63669 10.3266 3.62885 10.3182 3.62158ZM3.6211 10.3342V3.62158H3.80915C3.84217 3.62885 3.87519 3.63669 3.90821 3.64452C5.81111 4.10009 7.46159 5.20318 8.61508 6.70755C9.25871 7.54705 9.74675 8.51135 10.0378 9.55791C10.0876 9.73757 10.1318 9.91946 10.1699 10.1036C10.1855 10.1803 10.2006 10.2569 10.2146 10.3342H3.6211Z" fill="#F5F5F5" />
                 </g>
                 <path d="M10.3439 0V13.6462H3.85672C3.77725 13.7324 3.69889 13.8203 3.6211 13.9087C3.54051 14.0005 3.46103 14.0934 3.38324 14.1874C1.97398 15.8743 0.922345 17.87 0.343641 20.0577H0.343081C0.198685 20.604 0.0833916 21.1625 0 21.7311V24H12.2614C12.2664 23.9933 12.2714 23.9866 12.2765 23.9799H13.6561V3.62158H20.3616C20.3431 3.71504 20.3224 3.80738 20.3005 3.89917C19.8181 5.91283 18.6109 7.64387 16.9699 8.80181C16.4024 9.20253 15.7834 9.53441 15.1241 9.7857V10.3342H20.3593C20.366 10.3274 20.3727 10.3202 20.3789 10.3129C20.5345 10.1433 20.6856 9.97039 20.8334 9.79353C22.2197 8.13301 23.2607 6.17364 23.8455 4.02621C23.9009 3.82137 23.953 3.6143 24 3.40555V0H10.3439ZM10.3439 20.3784H3.85113C3.87855 20.2413 3.90933 20.1059 3.94347 19.9716C4.4427 18.0049 5.63537 16.3153 7.24668 15.1786C7.86232 14.7437 8.53953 14.39 9.26207 14.1326C9.53071 14.0363 9.80551 13.9541 10.0859 13.8852H10.0865C10.0954 13.883 10.1044 13.8807 10.1133 13.8785C10.1895 13.8606 10.2667 13.8432 10.3439 13.827V20.3784Z" fill="#F5F5F5" />
                 <defs>
                   <filter id="logoFilter1_layout" x="14.0305" y="10.3342" width="11.1695" height="13.6658" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                     <feFlood floodOpacity="0" result="BackgroundImageFix" />
                     <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                     <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                     <feOffset dx="2" />
                     <feGaussianBlur stdDeviation="0.6" />
                     <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                     <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0" />
                     <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                   </filter>
                   <filter id="logoFilter2_layout" x="-1.2" y="0" width="11.5439" height="13.6462" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                     <feFlood floodOpacity="0" result="BackgroundImageFix" />
                     <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                     <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                     <feOffset dx="-2" />
                     <feGaussianBlur stdDeviation="0.6" />
                     <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                     <feColorMatrix type="matrix" values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0" />
                     <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                   </filter>
                 </defs>
               </svg>
            </div>
            <span style={{ color: 'var(--text-white-0, #FFF)', fontSize: '24px', fontWeight: 600, lineHeight: '31.2px', fontFamily: 'Inter Tight, sans-serif' }}>Wealthy</span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
