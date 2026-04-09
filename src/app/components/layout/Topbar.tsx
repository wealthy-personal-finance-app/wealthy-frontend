import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk";
import imgAvatar from "../../../imports/TransactionsHistory/3bf6d91fffb576176d4a0070882aa4c6d17189e7.png";

export interface User {
  name: string;
  email: string;
  badge?: string;
  avatarUrl?: string;
}

interface TopbarProps {
  user: User;
  onAddTransaction?: () => void;
  onUserMenuClick?: () => void;
}

function ChevronLeftIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[32%_41%]">
        <div className="absolute inset-[-10.42%_-20.83%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.1 8.7">
            <path d={svgPaths.p19f1a00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-4.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d="M9 3V15M3 9H15" fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[41%_32%]">
        <div className="absolute inset-[-20.83%_-10.42%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.96 4.08">
            <path d="M0.6 0.6L3.48 3.48L6.36 0.6" stroke="#525866" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Topbar({ user, onAddTransaction, onUserMenuClick }: TopbarProps) {
  return (
    <div className="bg-[#191b1f] border-b border-[#2e2f33] w-full">
      <div className="flex items-center justify-between px-[24px] py-[16px]">
        {/* Add Transaction Button */}
        <button
          onClick={onAddTransaction}
          className="bg-[#065f46] hover:bg-[#047857] transition-colors rounded-[8px] flex items-center gap-[4px] px-[12px] py-[8px]"
        >
          <PlusIcon />
          <span className="text-white" style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', lineHeight: '24px', fontWeight: 500 }}>
            Add Transaction
          </span>
        </button>

        {/* User Profile */}
        <button
          onClick={onUserMenuClick}
          className="bg-[#1f2220] hover:bg-[#2a2d2b] transition-colors rounded-[8px] border border-[#2e2f33] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)] flex items-center gap-[8px] px-[6px] py-[6px] h-[40px]"
        >
          {/* Avatar */}
          <div className="relative shrink-0 size-[24px] rounded-full overflow-hidden">
            <img 
              src={user.avatarUrl || imgAvatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-[2px] items-start">
            <div className="flex items-center gap-[4px]">
              <p className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: 'normal', fontWeight: 500 }}>
                {user.name}
              </p>
              {user.badge && (
                <div className="bg-[#047857] rounded-[999px] px-[5px] py-[2px] h-[12px] flex items-center justify-center">
                  <p className="text-white uppercase" style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', letterSpacing: '0.16px', fontWeight: 500 }}>
                    {user.badge}
                  </p>
                </div>
              )}
            </div>
            <p className="text-[#717784]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', lineHeight: 'normal' }}>
              {user.email}
            </p>
          </div>

          {/* Chevron */}
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
}
