import { useState } from 'react';
import svgPaths from "../../../imports/TransactionsAutopilotBase-1/svg-l3wrwsdhjj";
import { EditAutopilotForm } from './EditAutopilotForm';

export interface AutopilotFlow {
  id: string;
  title: string;
  schedule: string;
  amount: number;
  type: 'income' | 'expense';
  icon: 'home' | 'receipt' | 'wallet' | 'car' | 'shopping' | 'coffee' | string;
  enabled: boolean;
}

interface AutopilotRowProps {
  flow: AutopilotFlow;
  onToggle?: (flowId: string, enabled: boolean) => void;
  onClick?: (flowId: string) => void;
  isExpanded?: boolean;
}

export function AutopilotIcon({ icon }: { icon: string }) {
  const containerClass = "bg-[rgba(65,63,63,0.5)] flex items-center justify-center size-[40px] rounded-[10px]";
  
  switch (icon) {
    case 'home':
      return (
        <div className={containerClass}>
          <div className="overflow-clip relative shrink-0 size-[20px]">
            <div className="absolute inset-[11.35%_10%_11.22%_8.68%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.2653 15.4844">
                <path d={svgPaths.p17d49680} fill="#99A0AE" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'receipt':
      return (
        <div className={containerClass}>
          <div className="overflow-clip relative shrink-0 size-[20px]">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 size-[15.5px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4167 17.4167">
                <path d={svgPaths.p2a1c1980} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'wallet':
      return (
        <div className={containerClass}>
          <div className="overflow-clip relative shrink-0 size-[20px]">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 size-[15.5px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.3333 19.3333">
                <path d={svgPaths.p27e46b80} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'car':
      return (
        <div className={containerClass}>
          <div className="overflow-clip relative shrink-0 size-[20px]">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 size-[15.5px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.3333 19.3333">
                <path d={svgPaths.p1a394f80} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'shopping':
      return (
        <div className={containerClass}>
          <div className="overflow-clip relative shrink-0 size-[20px]">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 size-[14.5px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.1667 18.1667">
                <path d={svgPaths.p2f4e8400} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    case 'coffee':
      return (
        <div className={containerClass}>
          <div className="overflow-clip relative shrink-0 size-[20px]">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 size-[15.5px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4167 17.4167">
                <path d={svgPaths.p18ca1580} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className={containerClass}>
          <div className="w-[20px] h-[20px] bg-[#717784] rounded-full" />
        </div>
      );
  }
}

function ChevronRightIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[32%_41%]">
        <div className="absolute inset-[-10.42%_-20.83%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.1 8.7">
            <path d={svgPaths.pc4f9900} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function AutopilotRow({ flow, onToggle, onClick, isExpanded }: AutopilotRowProps) {
  const [isEnabled, setIsEnabled] = useState(flow.enabled);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle?.(flow.id, newState);
  };

  const handleRowClick = () => {
    onClick?.(flow.id);
  };

  if (isExpanded) {
    return (
      <EditAutopilotForm 
        flow={flow} 
        onClose={() => onClick?.(flow.id)} 
      />
    );
  }

  const isIncome = flow.type === 'income';
  const formattedAmount = `${isIncome ? '+' : '-'}LKR ${flow.amount.toLocaleString()}`;
  const amountColor = isIncome ? '#10b981' : '#df1c41';

  return (
    <div className="bg-[#191b1f] relative rounded-[10px] w-full">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div
        onClick={handleRowClick}
        className="flex items-center gap-[12px] px-[17px] py-[13px] cursor-pointer hover:bg-white/[0.02] transition-colors rounded-[10px]"
      >
        <AutopilotIcon icon={flow.icon} />

        <div className="flex-1 flex flex-col gap-[4px]">
          <div className="flex items-center">
            <span style={{ fontFamily: 'var(--font-family)', fontSize: '14px', lineHeight: '18px', fontWeight: 500, color: 'white' }}>
              {flow.title}
            </span>
            <ChevronRightIcon />
          </div>
          <p style={{ fontFamily: 'var(--font-family)', fontSize: '12px', lineHeight: '16px', color: '#94a3b8' }}>
            {flow.schedule}
          </p>
        </div>

        <p style={{ fontFamily: 'var(--font-family)', fontSize: '14px', lineHeight: '18px', fontWeight: 600, color: amountColor }}>
          {formattedAmount}
        </p>

        <button
          onClick={handleToggle}
          className={`relative w-[35px] h-[20px] rounded-[999px] transition-colors cursor-pointer flex items-center p-[2px] ${
            isEnabled ? 'bg-[#065f46] justify-end' : 'bg-[#2e2f33] justify-start'
          }`}
        >
          <div className="size-[16px] rounded-full bg-white transition-all shadow-sm" />
        </button>
      </div>
    </div>
  );
}