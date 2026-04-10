import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCenteredLayout } from '../auth/AuthCenteredLayout';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function PlanSelection() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const monthlyPrice = 6.99;
  const annualPrice = 5.99;

  const handleSelectPlan = (plan: string) => {
    if (plan === 'Professional') {
      navigate(`/billing?plan=Professional&billing=${isAnnual ? 'annual' : 'monthly'}`);
    } else {
      toast.success('Staying on the Free plan');
      navigate('/dashboard');
    }
  };

  return (
    <AuthCenteredLayout
      showSignUpLink={false}
      showCloseButton={true}
      maxWidth="800px"
    >
      <div className="flex flex-col items-center w-full">

        {/* Title */}
        <h1
          className="text-white text-center mb-6"
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '32px',
            fontWeight: 500,
            lineHeight: '1.2',
          }}
        >
          Upgrade your plan
        </h1>

        {/* Billing Toggle */}
        <div className="flex bg-[#191B1F] border border-[#2E2F33] rounded-full p-[3px] mb-10">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-[6px] rounded-full text-[13px] font-medium transition-all duration-200 ${!isAnnual
                ? 'bg-[#2E2F33] text-white'
                : 'text-[#717784] hover:text-white'
              }`}
            style={{ fontFamily: 'Inter Tight, sans-serif' }}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-[6px] rounded-full text-[13px] font-medium transition-all duration-200 ${isAnnual
                ? 'bg-[#2E2F33] text-white'
                : 'text-[#717784] hover:text-white'
              }`}
            style={{ fontFamily: 'Inter Tight, sans-serif' }}
          >
            Annual
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-5 w-full">

          {/* Free Plan Card */}
          <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[16px] p-6 flex flex-col">
            {/* Plan Name */}
            <span
              className="text-[#99A0AE] mb-3"
              style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              Free Plan
            </span>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span
                className="text-white"
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '32px',
                  fontWeight: 500,
                  lineHeight: '1',
                }}
              >
                $0
              </span>
              <span className="text-[#717784] text-[13px]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                / Month
              </span>
            </div>

            {/* Button */}
            <Button
              onClick={() => handleSelectPlan('Free')}
              className="w-full h-[44px] bg-[#065f46] hover:bg-[#047857] text-white text-[14px] font-semibold rounded-[10px]"
            >
              Continue using Free
            </Button>

            {/* Divider space */}
            <div className="mt-8 mb-4 border-t border-[#2E2F33]" />

            {/* Features */}
            <span
              className="text-white mb-3"
              style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', fontWeight: 500 }}
            >
              Features:
            </span>
            <div className="flex flex-col gap-[10px]">
              <FeatureItem text="Track manual spending" />
              <FeatureItem text="Basic cash flow view" />
              <FeatureItem text="5 Autopilot flows" />
              <FeatureItem text="Manage one account" />
              <FeatureItem text="Limited access to assistant templates" />
              <FeatureItem text="Help center support" />
            </div>
          </div>

          {/* Professional Plan Card */}
          <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[16px] p-6 flex flex-col">
            {/* Plan Name */}
            <span
              className="text-[#99A0AE] mb-3"
              style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              Professional Plan
            </span>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span
                className="text-white"
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '32px',
                  fontWeight: 500,
                  lineHeight: '1',
                }}
              >
                ${isAnnual ? annualPrice : monthlyPrice}
              </span>
              <span className="text-[#717784] text-[13px]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                / Month
              </span>
            </div>

            {/* Button */}
            <Button
              onClick={() => handleSelectPlan('Professional')}
              className="w-full h-[44px] bg-[#065f46] hover:bg-[#047857] text-white text-[14px] font-semibold rounded-[10px]"
            >
              Get Professional
            </Button>

            {/* Divider space */}
            <div className="mt-8 mb-4 border-t border-[#2E2F33]" />

            {/* Features */}
            <span
              className="text-white mb-3"
              style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', fontWeight: 500 }}
            >
              Everything in Standard, plus:
            </span>
            <div className="flex flex-col gap-[10px]">
              <FeatureItem text="Unlimited autopilot flows" />
              <FeatureItem text="Detailed zoom levels" />
              <FeatureItem text="Unlimited portfolios" />
              <FeatureItem text="Pro data exports" />
              <FeatureItem text="AI smart insights" />
            </div>
          </div>

        </div>
      </div>
    </AuthCenteredLayout>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[10px]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
        <circle cx="8" cy="8" r="8" fill="#10B981" fillOpacity="0.12" />
        <path
          d="M11 6L6.875 10L5 8.18"
          stroke="#10B981"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-[#99A0AE]"
        style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', fontWeight: 400 }}
      >
        {text}
      </span>
    </div>
  );
}
