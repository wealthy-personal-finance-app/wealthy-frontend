import { useNavigate, Link } from 'react-router-dom';
import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk";
import imgAvatar from "../../../imports/TransactionsHistory/3bf6d91fffb576176d4a0070882aa4c6d17189e7.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User as UserIcon, Settings, Shield, LogOut, ChevronRight, Zap } from 'lucide-react';

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

function PlusIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-4.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d={svgPaths.p253fc100} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
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

export function Topbar({ user, onAddTransaction }: TopbarProps) {
  const navigate = useNavigate();

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

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="bg-[#1f2220] hover:bg-[#2a2d2b] transition-colors rounded-[8px] border border-[#2e2f33] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)] flex items-center gap-[8px] px-[6px] py-[6px] h-[40px] outline-none"
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
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[280px] bg-[#191b1f] border-[#2e2f33] p-1 mt-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-[12px]"
          >
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[14px] font-semibold">{user.name}</span>
                  <div className="bg-[#047857] rounded-[999px] px-[5px] py-[2px] h-[14px] flex items-center justify-center">
                    <p className="text-white uppercase" style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', letterSpacing: '0.16px', fontWeight: 600 }}>
                      Free Plan
                    </p>
                  </div>
                </div>
                <span className="text-[#717784] text-[12px]">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-[#2e2f33] mx-0" />

            <DropdownMenuGroup className="px-1 py-1">
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="text-[#99A0AE] hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-[8px] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-[28px] rounded-[6px] bg-white/5 flex items-center justify-center">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-[13px] font-medium">Profile Settings</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/plans')}
                className="text-[#99A0AE] hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-[8px] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-[28px] rounded-[6px] bg-[#10B981]/15 flex items-center justify-center">
                    <Zap size={14} className="text-[#10B981]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white">Upgrade to Pro</span>
                    <span className="text-[11px] text-[#10B981]">Get 20% off yearly</span>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-[#2e2f33] mx-0" />

            <DropdownMenuGroup className="px-1 py-1">
              <DropdownMenuItem className="text-[#F87171] hover:bg-red-500/10 px-3 py-2.5 rounded-[8px] cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="size-[28px] rounded-[6px] bg-red-500/10 flex items-center justify-center">
                    <LogOut size={14} />
                  </div>
                  <span className="text-[13px] font-medium">Sign Out</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
