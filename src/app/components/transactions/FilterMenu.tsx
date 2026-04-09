import { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import svgPaths from '../../../imports/TransactionsHistoryFilterBy/svg-a4nz9b6j1h';
import searchSvgPaths from '../../../imports/TransactionsHistoryFilterByCategory/svg-nxa6h87swv';

// ===== TYPE DEFINITIONS =====
export interface FilterState {
  account: string[];
  type: string[];
  category: string[];
  date: string | null;
  recurring: string[];
}

interface FilterMenuProps {
  onChange?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

// ===== MOCK DATA =====
const ACCOUNTS = ['Cash Account', 'Bank Account', 'Current Account'];
const TYPES = ['Income', 'Expenses', 'Assets', 'Liability'];
const RECURRING_OPTIONS = ['Monthly Flows', 'Weekly Flows', 'Daily Flows'];
const DATE_OPTIONS = ['This Week', 'Last Week', 'This Month', 'Last Month'];

const CATEGORY_HIERARCHY = {
  'Essential Living': ['Housing', 'Food & Dining', 'Transportation', 'Utilities'],
  'Obligations & Liabilities': ['Debt Payments', 'Insurance', 'Taxes'],
  'Discretionary & Lifestyle': ['Entertainment', 'Shopping', 'Travel', 'Personal Care'],
  'Growth & Giving': ['Savings', 'Investments', 'Donations', 'Education'],
};

// ===== ICON COMPONENTS (Matching Figma exactly) =====
function CreditCardIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[20%_8.75%]">
        <div className="absolute inset-[-5%_-3.64%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.7 13.2">
            <path d={svgPaths.p25fe4d00} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[42.5%_8.75%_57.5%_8.75%]">
        <div className="absolute inset-[-0.6px_-3.64%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.7 1.2">
            <path d="M0.6 0.6H17.1" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CryptocurrencyIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[12.55%_8.33%_8.33%_8.33%]">
        <div className="absolute inset-[-3.79%_-3.6%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.8666 17.0235">
            <path d={svgPaths.p2fa0a000} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PieChartIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[15.61%_15.46%_12.52%_12.5%]">
        <div className="absolute inset-[-4.18%_-4.17%_-4.17%_-4.16%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.608 15.5741">
            <path d={svgPaths.p1476e3c0} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-1/2 right-[12.5%] top-[12.5%]">
        <div className="absolute inset-[-8%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.7 8.7">
            <path d={svgPaths.p5f4bb00} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[20%_16.25%_12.5%_16.25%]">
        <div className="absolute inset-[-4.44%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7 14.7">
            <path d={svgPaths.p1454f480} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[42.5%_16.25%_57.5%_16.25%]">
        <div className="absolute inset-[-0.6px_-4.44%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7 1.2">
            <path d="M0.6 0.6H14.1" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_35%_72.5%_65%]">
        <div className="absolute inset-[-20%_-0.6px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.2 4.2">
            <path d="M0.6 0.6V3.6" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_65%_72.5%_35%]">
        <div className="absolute inset-[-20%_-0.6px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.2 4.2">
            <path d="M0.6 0.6V3.6" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[57.5%_68.75%_20%_8.75%]">
        <div className="absolute inset-[-13.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7 5.7">
            <path d="M0.6 5.1V0.6H5.1" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20%_8.75%_57.5%_68.75%]">
        <div className="absolute inset-[-13.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7 5.7">
            <path d="M5.1 0.6V5.1H0.6" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.26%_8.75%]">
        <div className="absolute inset-[-4.45%_-3.64%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.7 14.6965">
            <path d={svgPaths.p1a055380} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
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
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 8.4">
            <path d="M0.6 7.8L4.2 4.2L0.6 0.6" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[16.25%]">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9999 15">
            <path d={searchSvgPaths.p31d7be00} stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ===== REUSABLE COMPONENTS =====
function Divider() {
  return (
    <div className="h-0 relative shrink-0 w-full px-[8px]">
      <div className="absolute inset-[-1px_8px_0_8px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 248 1">
          <line stroke="#2E2F33" strokeLinecap="round" x1="0.5" x2="247.5" y1="0.5" y2="0.5" />
        </svg>
      </div>
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute bg-[#15161a] inset-[10%] rounded-[4px]" />
      <div
        className={`absolute border border-solid inset-[17.5%] rounded-[2.5px] transition-colors ${
          checked ? 'bg-[#065f46] border-[#065f46]' : 'bg-[#1f2220] border-[#2e2f33]'
        }`}
      >
        {checked && (
          <svg className="absolute inset-0" fill="none" viewBox="0 0 13 13">
            <path d="M2 6.5L5.5 10L11 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

// ===== SUB-MENU WRAPPER =====
function SubmenuWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#15161a] relative rounded-[16px] size-full">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[16px] relative rounded-[inherit] size-full">
        {children}
      </div>
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)]" />
    </div>
  );
}

// ===== SUB-MENU COMPONENTS =====
function AccountSubmenu({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (account: string) => void;
}) {
  return (
    <div className="w-[280px]">
      <SubmenuWrapper>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          {ACCOUNTS.map((account, idx) => (
            <div key={account} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              {idx > 0 && <Divider />}
              <button
                onClick={() => onToggle(account)}
                className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer rounded-[6px] hover:bg-[#212429] transition-colors"
              >
                <Checkbox checked={selected.includes(account)} />
                <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                  <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <p className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap" style={{ fontWeight: 500 }}>
                        {account}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

function TypeSubmenu({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (type: string) => void;
}) {
  return (
    <div className="w-[280px]">
      <SubmenuWrapper>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          {TYPES.map((type, idx) => (
            <div key={type} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              {idx > 0 && <Divider />}
              <button
                onClick={() => onToggle(type)}
                className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer rounded-[6px] hover:bg-[#212429] transition-colors"
              >
                <Checkbox checked={selected.includes(type)} />
                <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                  <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <p className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap" style={{ fontWeight: 500 }}>
                        {type}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

function RecurringSubmenu({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (recurring: string) => void;
}) {
  return (
    <div className="w-[280px]">
      <SubmenuWrapper>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          {RECURRING_OPTIONS.map((option, idx) => (
            <div key={option} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              {idx > 0 && <Divider />}
              <button
                onClick={() => onToggle(option)}
                className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer rounded-[6px] hover:bg-[#212429] transition-colors"
              >
                <Checkbox checked={selected.includes(option)} />
                <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                  <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <p className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap" style={{ fontWeight: 500 }}>
                        {option}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

function DateSubmenu({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  return (
    <div className="w-[280px]">
      <SubmenuWrapper>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          {DATE_OPTIONS.map((option, idx) => (
            <div key={option} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              {idx > 0 && <Divider />}
              <button
                onClick={() => onSelect(option)}
                className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer rounded-[6px] hover:bg-[#212429] transition-colors"
              >
                <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                  <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <p
                        className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] whitespace-nowrap"
                        style={{
                          fontWeight: 500,
                          color: selected === option ? 'white' : '#717784',
                        }}
                      >
                        {option}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

// ===== CATEGORY SUB-MENU (3-LEVEL) =====
function CategoryChildrenSubmenu({
  parentCategory,
  selected,
  onToggle,
}: {
  parentCategory: string;
  selected: string[];
  onToggle: (category: string) => void;
}) {
  const children = CATEGORY_HIERARCHY[parentCategory as keyof typeof CATEGORY_HIERARCHY] || [];

  return (
    <div className="w-[280px]">
      <SubmenuWrapper>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          {children.map((child, idx) => (
            <div key={child} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              {idx > 0 && <Divider />}
              <button
                onClick={() => onToggle(child)}
                className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer rounded-[6px] hover:bg-[#212429] transition-colors"
              >
                <Checkbox checked={selected.includes(child)} />
                <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                  <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <p className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap" style={{ fontWeight: 500 }}>
                        {child}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

function CategorySubmenu({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (category: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeParent, setActiveParent] = useState<string | null>(null);

  const parentCategories = Object.keys(CATEGORY_HIERARCHY);

  const filteredParents = searchQuery
    ? parentCategories.filter((parent) => {
        const children = CATEGORY_HIERARCHY[parent as keyof typeof CATEGORY_HIERARCHY];
        return (
          parent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          children.some((child) => child.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
    : parentCategories;

  return (
    <div className="w-[280px]">
      <SubmenuWrapper>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          {/* Search Bar */}
          <div className="bg-[#141414] relative rounded-[8px] shrink-0 w-full">
            <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex gap-[4px] items-center p-[8px] relative w-full">
                <SearchIcon />
                <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#99a0ae] text-[14px]">
                  <input
                    type="text"
                    placeholder="Search Category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="leading-[18px] bg-transparent border-none outline-none placeholder:text-[#99a0ae]"
                    style={{ fontWeight: 500 }}
                  />
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)]" />
          </div>

          {/* Parent Categories */}
          {filteredParents.map((parent, idx) => (
            <div key={parent} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              {idx > 0 && <Divider />}
              <Popover.Root open={activeParent === parent} onOpenChange={(open) => !open && setActiveParent(null)}>
                <Popover.Trigger asChild>
                  <button
                    onMouseEnter={() => setActiveParent(parent)}
                    className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer rounded-[6px] hover:bg-[#212429] transition-colors"
                  >
                    <Checkbox checked={false} />
                    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                      <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
                        <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                          <p className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap" style={{ fontWeight: 500 }}>
                            {parent}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChevronRightIcon />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    side="right"
                    align="start"
                    sideOffset={8}
                    onMouseEnter={() => setActiveParent(parent)}
                    onMouseLeave={() => setActiveParent(null)}
                    className="z-[100]"
                  >
                    <CategoryChildrenSubmenu parentCategory={parent} selected={selected} onToggle={onToggle} />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

// ===== MAIN FILTER MENU =====
export function FilterMenu({ onChange, initialFilters }: FilterMenuProps) {
  const [filters, setFilters] = useState<FilterState>({
    account: initialFilters?.account || [],
    type: initialFilters?.type || [],
    category: initialFilters?.category || [],
    date: initialFilters?.date || null,
    recurring: initialFilters?.recurring || [],
  });

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMainOpen, setIsMainOpen] = useState(false);

  useEffect(() => {
    onChange?.(filters);
  }, [filters, onChange]);

  const toggleArrayFilter = (key: 'account' | 'type' | 'category' | 'recurring', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const setDateFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      date: prev.date === value ? null : value,
    }));
  };

  const menuItems = [
    { id: 'account', label: 'Account', Icon: CreditCardIcon },
    { id: 'type', label: 'Type', Icon: CryptocurrencyIcon },
    { id: 'category', label: 'Category', Icon: PieChartIcon },
    { id: 'date', label: 'Date', Icon: CalendarIcon },
    { id: 'recurring', label: 'Recurring', Icon: RefreshIcon },
  ];

  const renderSubmenu = (menuId: string) => {
    switch (menuId) {
      case 'account':
        return <AccountSubmenu selected={filters.account} onToggle={(v) => toggleArrayFilter('account', v)} />;
      case 'type':
        return <TypeSubmenu selected={filters.type} onToggle={(v) => toggleArrayFilter('type', v)} />;
      case 'category':
        return <CategorySubmenu selected={filters.category} onToggle={(v) => toggleArrayFilter('category', v)} />;
      case 'date':
        return <DateSubmenu selected={filters.date} onSelect={setDateFilter} />;
      case 'recurring':
        return <RecurringSubmenu selected={filters.recurring} onToggle={(v) => toggleArrayFilter('recurring', v)} />;
      default:
        return null;
    }
  };

  return (
    <Popover.Root open={isMainOpen} onOpenChange={setIsMainOpen}>
      <Popover.Trigger asChild>
        <div className="bg-[#191b1f] relative rounded-[8px] shrink-0">
          <button className="flex flex-col items-start px-[16px] py-[8px] relative cursor-pointer">
            <div className="overflow-clip relative shrink-0 size-[20px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path
                  d="M2.5 5.83333H17.5M5.83333 10H14.1667M8.33333 14.1667H11.6667"
                  stroke="#99A0AE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px]" />
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content side="bottom" align="start" sideOffset={8} className="z-50 w-[280px]">
          <div className="bg-[#15161a] relative rounded-[16px] size-full">
            <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[inherit] size-full">
              <div className="content-stretch flex items-center relative shrink-0 w-full">
                <p className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontWeight: 500 }}>
                  Filter by
                </p>
              </div>

              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                {menuItems.map(({ id, label, Icon }, idx) => (
                  <div key={id} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    {idx > 0 && <Divider />}
                    <Popover.Root open={activeMenu === id} onOpenChange={(open) => !open && setActiveMenu(null)}>
                      <Popover.Trigger asChild>
                        <button
                          onMouseEnter={() => setActiveMenu(id)}
                          className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer rounded-[6px] hover:bg-[#212429] transition-colors"
                        >
                          <Icon />
                          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
                              <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                                <p className="font-['Inter_Tight',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#717784] text-[14px] whitespace-nowrap" style={{ fontWeight: 500 }}>
                                  {label}
                                </p>
                              </div>
                            </div>
                          </div>
                          <ChevronRightIcon />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          side="right"
                          align="start"
                          sideOffset={8}
                          onMouseEnter={() => setActiveMenu(id)}
                          onMouseLeave={() => setActiveMenu(null)}
                          className="z-[100]"
                        >
                          {renderSubmenu(id)}
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  </div>
                ))}
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)]" />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}