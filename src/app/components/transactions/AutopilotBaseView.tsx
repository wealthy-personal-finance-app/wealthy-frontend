import { useState } from 'react';
import svgPaths from "../../../imports/TransactionsAutopilotBase-1/svg-l3wrwsdhjj";
import { AutopilotFlow, AutopilotRow } from './AutopilotRow';

export interface AutopilotFlowGroup {
  frequency: 'monthly' | 'weekly' | 'daily' | 'yearly';
  label: string;
  flows: AutopilotFlow[];
}

interface AutopilotBaseViewProps {
  flowGroups: AutopilotFlowGroup[];
  totalSavings?: number;
  onNewFlowClick?: () => void;
  onFlowToggle?: (flowId: string, enabled: boolean) => void;
  onFlowClick?: (flowId: string) => void;
  onAutopilotRefresh?: () => void; // <--- ADDED PROP
}

function PlusIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-4.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path 
              d="M9 3.75V14.25M3.75 9H14.25" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[32%_41%]">
        <div className="absolute inset-[-10.42%_-20.83%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.1 8.7">
            <path d={svgPaths.pc4f9900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function AutopilotBaseView({
  flowGroups,
  totalSavings,
  onNewFlowClick,
  onFlowToggle,
  onFlowClick,
  onAutopilotRefresh // <--- DESTRUCTURED PROP
}: AutopilotBaseViewProps) {
  const [expandedFlowId, setExpandedFlowId] = useState<string | null>(null);

  const handleFlowClick = (flowId: string) => {
    setExpandedFlowId(expandedFlowId === flowId ? null : flowId);
    onFlowClick?.(flowId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Info Banner + New Flow Button */}
      <div className="px-[32px] pt-[0px] pb-[16px] flex items-center justify-between gap-[16px]">
        {/* Savings Info Text */}
        {totalSavings !== undefined && (
          <div className="flex-1">
            <p style={{ fontFamily: 'var(--font-family)', fontSize: '14px', lineHeight: '21px', color: '#94a3b8' }}>
              {/* You have{' '}
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '14px', fontWeight: 600, color: '#40c4aa' }}>
                LKR {totalSavings.toLocaleString()}
              </span> */}
              {/* {' '}on autopilot this month. */}
            </p>
          </div>
        )}

        {/* New Autopilot Flow Button */}
        <button
          onClick={onNewFlowClick}
          className="bg-[#191b1f] hover:bg-[#1f2220] transition-colors rounded-[8px] flex items-center gap-[4px] px-[12px] py-[8px] cursor-pointer shrink-0"
          style={{ border: '1px solid #2e2f33' }}
        >
          <ChevronRightIcon />
          <span style={{ fontFamily: 'var(--font-family)', fontSize: '16px', lineHeight: '24px', fontWeight: 500, color: 'white' }}>
            New Autopilot Flow
          </span>
        </button>
      </div>

      {/* Flow Groups */}
      <div className="flex-1 overflow-y-auto px-[32px] pb-[32px]">
        {flowGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p style={{ fontFamily: 'var(--font-family)', fontSize: '16px', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
                No autopilot flows set up yet
              </p>
              <button
                onClick={onNewFlowClick}
                className="bg-[#065f46] hover:bg-[#047857] transition-colors rounded-[8px] flex items-center gap-[6px] px-[16px] py-[10px] mx-auto cursor-pointer"
              >
                <PlusIcon />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: '14px', fontWeight: 500, color: 'white' }}>
                  Create Your First Flow
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[24px]">
            {flowGroups.map((group) => (
              <div key={group.frequency}>
                {/* Frequency Header */}
                <div className="h-[21px] mb-[12px]">
                  <p
                    className="ml-[8px]"
                    style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: '14px',
                      lineHeight: '18px',
                      fontWeight: 600,
                      color: '#717784',
                    }}
                  >
                    {group.label}
                  </p>
                </div>

                {/* Flows */}
                <div className="flex flex-col gap-[12px]">
                  {group.flows.map((flow) => (
                    <AutopilotRow
                      key={flow.id}
                      flow={flow}
                      isExpanded={expandedFlowId === flow.id}
                      onToggle={onFlowToggle}
                      onClick={handleFlowClick}
                      onAutopilotRefresh={onAutopilotRefresh} // <--- PASSED TO ROW
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}