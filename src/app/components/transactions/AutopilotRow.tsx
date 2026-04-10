import { useState } from 'react';
import svgPaths from "../../../imports/TransactionsAutopilotBase-1/svg-l3wrwsdhjj";
import { EditAutopilotForm } from './EditAutopilotForm';
import { CategoryIcon } from './CategoryIcon';

export interface AutopilotFlow {
  id: string;
  title: string;
  schedule: string;
  amount: number;
  type: 'income' | 'expense' | 'asset' | 'liability';
  category: string;
  icon: string;
  enabled: boolean;
}

interface AutopilotRowProps {
  flow: AutopilotFlow;
  onToggle?: (flowId: string, enabled: boolean) => void;
  onClick?: (flowId: string) => void;
  isExpanded?: boolean;
  onAutopilotRefresh?: () => void; // <--- ADDED PROP
}

export function AutopilotIcon({ icon }: { icon: string }) {
  const containerClass = "bg-[rgba(65,63,63,0.5)] flex items-center justify-center size-[40px] rounded-[10px]";
  
  return (
    <div className={containerClass}>
      <CategoryIcon icon={icon} size={20} color="#99a0ae" />
    </div>
  );
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

export function AutopilotRow({ flow, onToggle, onClick, isExpanded, onAutopilotRefresh }: AutopilotRowProps) {
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
        onRefresh={onAutopilotRefresh} // <--- PASSED TO FORM
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