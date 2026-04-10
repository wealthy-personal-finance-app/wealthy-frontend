import { useState } from 'react';
import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk";
import { HistoryView, TransactionGroup } from './HistoryView';
import { AutopilotBaseView, AutopilotFlowGroup } from './AutopilotBaseView';
import { FilterState } from './FilterMenu';

export type TabType = 'history' | 'autopilot';

interface TransactionsPageProps {
  transactionGroups?: TransactionGroup[];
  autopilotFlowGroups?: AutopilotFlowGroup[];
  autopilotTotalSavings?: number;
  initialTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  onCategoryChange?: (category: 'all' | 'income' | 'expenses') => void;
  onSearchChange?: (query: string) => void;
  onTransactionMenuClick?: (transactionId: string) => void;
  onNewAutopilotFlowClick?: () => void;
  onAutopilotFlowToggle?: (flowId: string, enabled: boolean) => void;
  onAutopilotFlowClick?: (flowId: string) => void;
  onFilterChange?: (filters: FilterState) => void;
}

/** History tab — transaction card icon (p2e356bf0) */
function HistoryTabIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <path
          d={svgPaths.p2e356bf0}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M7.70833 8.33333H12.2917"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/** Autopilot tab — bot/wallet icon (p1fe7ba50) */
function AutopilotTabIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      {/* Corner path */}
      <div className="absolute bottom-[66.67%] left-[33.33%] right-1/2 top-[16.67%]">
        <div className="absolute inset-[-22.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.83333 4.83333">
            <path
              d="M4.08333 4.08333V0.75H0.75"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
      {/* Bot body */}
      <div className="absolute inset-[33.33%_16.67%_16.67%_16.67%]">
        <div className="absolute inset-[-7.5%_-5.63%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8333 11.5">
            <path
              d={svgPaths.p1fe7ba50}
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

export function TransactionsPage({
  transactionGroups = [],
  autopilotFlowGroups = [],
  autopilotTotalSavings,
  initialTab = 'history',
  onTabChange,
  onCategoryChange,
  onSearchChange,
  onTransactionMenuClick,
  onNewAutopilotFlowClick,
  onAutopilotFlowToggle,
  onAutopilotFlowClick,
  onFilterChange,
}: TransactionsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const tabs: { id: TabType; label: string; Icon: React.FC }[] = [
    { id: 'history',   label: 'History',   Icon: HistoryTabIcon },
    { id: 'autopilot', label: 'Autopilot', Icon: AutopilotTabIcon },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-col gap-[16px] items-start px-[32px] pt-[16px] pb-[16px] relative w-full">

          {/* Heading — 20px / 500 weight matching Figma */}
          <p
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: '20px',
              lineHeight: '26px',
              fontWeight: 500,
              color: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            Transactions
          </p>

          {/* Tab Toggle — Switch Toggle style from Figma */}
          <div className="bg-[#191b1f] relative rounded-[12px] shrink-0">
            {/* Outer border ring */}
            <div
              aria-hidden="true"
              className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[12px]"
            />
            <div className="flex gap-[4px] items-start p-[4px] relative">
              {tabs.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
                    className="relative rounded-[8px] shrink-0 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isActive ? 'rgba(65,63,63,0.5)' : 'transparent',
                    }}
                  >
                    {/* Inner shadow for active tab */}
                    {isActive && (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none rounded-[8px]"
                        style={{ boxShadow: '0px 1px 6px 0px rgba(14,18,27,0.08)' }}
                      />
                    )}
                    <div className="flex gap-[8px] items-center justify-center px-[24px] py-[4px] relative">
                      <div style={{ color: isActive ? 'white' : '#99A0AE' }}>
                        <Icon />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-family)',
                          fontSize: '16px',
                          lineHeight: '24px',
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? 'white' : '#717784',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── View Content ────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'history' ? (
          <HistoryView
            transactionGroups={transactionGroups}
            onCategoryChange={onCategoryChange}
            onSearchChange={onSearchChange}
            onTransactionMenuClick={onTransactionMenuClick}
            onFilterChange={onFilterChange}
          />
        ) : (
          <AutopilotBaseView
            flowGroups={autopilotFlowGroups}
            totalSavings={autopilotTotalSavings}
            onNewFlowClick={onNewAutopilotFlowClick}
            onFlowToggle={onAutopilotFlowToggle}
            onFlowClick={onAutopilotFlowClick}
          />
        )}
      </div>
    </div>
  );
}