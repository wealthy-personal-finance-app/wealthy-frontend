import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import svgPaths from '../../../imports/TransactionsHistoryFilterBy/svg-a4nz9b6j1h';
import searchSvgPaths from '../../../imports/TransactionsHistoryFilterByCategory/svg-nxa6h87swv';
import React from 'react';

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
  return <div className="h-px bg-[#2e2f33] w-full" />;
}

function Checkbox({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute bg-[#15161a] inset-[10%] rounded-[4px]" />
      <div
        className={`absolute border border-solid inset-[17.5%] rounded-[2.5px] transition-colors ${
          checked || indeterminate ? 'bg-[#065f46] border-[#065f46]' : 'bg-[#1f2220] border-[#2e2f33]'
        }`}
      >
        {checked && !indeterminate && (
          <svg className="absolute inset-0" fill="none" viewBox="0 0 13 13">
            <path d="M2 6.5L5.5 10L11 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[2px] w-[8px] bg-white rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

// ===== SUB-MENU WRAPPER =====
function SubmenuWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#15161a] relative rounded-[12px] border border-[#2e2f33] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] overflow-hidden">
      <div className="flex flex-col items-start p-[12px] relative">
        {children}
      </div>
    </div>
  );
}

// ===== SUB-MENU COMPONENTS =====
function AccountSubmenu({ selected, onToggle }: { selected: string[]; onToggle: (account: string) => void; }) {
  return (
    <div className="w-[240px]">
      <SubmenuWrapper>
        <div className="flex flex-col items-start w-full">
          {ACCOUNTS.map((account, idx) => (
            <div key={account} className="flex flex-col w-full">
              {idx > 0 && <Divider />}
              <DropdownMenu.Item
                onSelect={(e) => { e.preventDefault(); onToggle(account); }}
                className="flex gap-[10px] items-center py-[10px] px-[8px] w-full cursor-pointer rounded-[8px] hover:bg-white/[0.04] transition-colors outline-none group"
              >
                <Checkbox checked={selected.includes(account)} />
                <span className="font-['Inter_Tight',sans-serif] text-[14px] text-white font-medium group-hover:text-white transition-colors">{account}</span>
              </DropdownMenu.Item>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

function TypeSubmenu({ selected, onToggle }: { selected: string[]; onToggle: (type: string) => void; }) {
  return (
    <div className="w-[240px]">
      <SubmenuWrapper>
        <div className="flex flex-col items-start w-full">
          {TYPES.map((type, idx) => (
            <div key={type} className="flex flex-col w-full">
              {idx > 0 && <Divider />}
              <DropdownMenu.Item
                onSelect={(e) => { e.preventDefault(); onToggle(type); }}
                className="flex gap-[10px] items-center py-[10px] px-[8px] w-full cursor-pointer rounded-[8px] hover:bg-white/[0.04] transition-colors outline-none group"
              >
                <Checkbox checked={selected.includes(type)} />
                <span className="font-['Inter_Tight',sans-serif] text-[14px] text-white font-medium group-hover:text-white transition-colors">{type}</span>
              </DropdownMenu.Item>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

function RecurringSubmenu({ selected, onToggle }: { selected: string[]; onToggle: (recurring: string) => void; }) {
  return (
    <div className="w-[240px]">
      <SubmenuWrapper>
        <div className="flex flex-col items-start w-full">
          {RECURRING_OPTIONS.map((option, idx) => (
            <div key={option} className="flex flex-col w-full">
              {idx > 0 && <Divider />}
              <DropdownMenu.Item
                onSelect={(e) => { e.preventDefault(); onToggle(option); }}
                className="flex gap-[10px] items-center py-[10px] px-[8px] w-full cursor-pointer rounded-[8px] hover:bg-white/[0.04] transition-colors outline-none group"
              >
                <Checkbox checked={selected.includes(option)} />
                <span className="font-['Inter_Tight',sans-serif] text-[14px] text-white font-medium group-hover:text-white transition-colors">{option}</span>
              </DropdownMenu.Item>
            </div>
          ))}
        </div>
      </SubmenuWrapper>
    </div>
  );
}

function DateSubmenu({ selected, onSelect }: { selected: string | null; onSelect: (date: string) => void; }) {
  return (
    <div className="w-[240px]">
      <SubmenuWrapper>
        <div className="flex flex-col items-start w-full">
          {DATE_OPTIONS.map((option, idx) => (
            <div key={option} className="flex flex-col w-full">
              {idx > 0 && <Divider />}
              <DropdownMenu.Item
                onSelect={(e) => { e.preventDefault(); onSelect(option); }}
                className="flex items-center py-[10px] px-[8px] w-full cursor-pointer rounded-[8px] hover:bg-white/[0.04] transition-colors outline-none group"
              >
                <span className="font-['Inter_Tight',sans-serif] text-[14px] font-medium transition-colors" style={{ color: selected === option ? 'white' : '#717784' }}>{option}</span>
              </DropdownMenu.Item>
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
  onToggleMultiple,
}: {
  selected: string[];
  onToggle: (category: string) => void;
  onToggleMultiple: (categories: string[]) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
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
    <div className="w-[240px]">
      <SubmenuWrapper>
        <div className="flex flex-col gap-[12px] items-start w-full">
          <div className="bg-[#141414] border border-[#2e2f33] rounded-[8px] w-full px-[8px] py-[6px] flex items-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search Category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="bg-transparent flex-1 text-white text-[14px] outline-none font-medium placeholder:text-[#717784]"
            />
          </div>
          <div className="flex flex-col w-full">
            {filteredParents.map((parent, idx) => {
              const children = CATEGORY_HIERARCHY[parent as keyof typeof CATEGORY_HIERARCHY] || [];
              const selectedChildren = children.filter((c) => selected.includes(c));
              const isAllSelected = children.length > 0 && selectedChildren.length === children.length;
              const isSomeSelected = selectedChildren.length > 0 && !isAllSelected;

              return (
                <div key={parent} className="flex flex-col w-full">
                  {idx > 0 && <Divider />}
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger asChild>
                      <div className="flex gap-[10px] items-center py-[10px] px-[8px] w-full cursor-pointer rounded-[8px] hover:bg-white/[0.04] transition-colors outline-none group">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMultiple(children);
                          }}
                        >
                          <Checkbox checked={isAllSelected} indeterminate={isSomeSelected} />
                        </div>
                        <span className="flex-1 text-left text-white text-[14px] font-medium group-hover:text-white transition-colors">
                          {parent}
                        </span>
                        <ChevronRightIcon />
                      </div>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.SubContent sideOffset={8} className="z-[110] animate-in fade-in zoom-in-95 duration-200 outline-none">
                        <div className="w-[240px]">
                          <SubmenuWrapper>
                            <div className="flex flex-col items-start w-full">
                              {children.map((child, cIdx) => (
                                <div key={child} className="flex flex-col w-full">
                                  {cIdx > 0 && <Divider />}
                                  <DropdownMenu.Item
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      onToggle(child);
                                    }}
                                    className="flex gap-[10px] items-center py-[10px] px-[8px] w-full cursor-pointer rounded-[8px] hover:bg-white/[0.04] transition-colors outline-none group"
                                  >
                                    <Checkbox checked={selected.includes(child)} />
                                    <span className="font-['Inter_Tight',sans-serif] text-[14px] text-white font-medium group-hover:text-white transition-colors">
                                      {child}
                                    </span>
                                  </DropdownMenu.Item>
                                </div>
                              ))}
                            </div>
                          </SubmenuWrapper>
                        </div>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Sub>
                </div>
              );
            })}
          </div>
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

  const toggleMultipleValues = (key: 'category', values: string[]) => {
    setFilters((prev) => {
      const current = prev[key];
      const allIncluded = values.every((v) => current.includes(v));
      if (allIncluded) {
        // Unselect all children
        return { ...prev, [key]: current.filter((v) => !values.includes(v)) };
      } else {
        // Select all children
        const newSet = new Set([...current, ...values]);
        return { ...prev, [key]: Array.from(newSet) };
      }
    });
  };

  const setDateFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      date: prev.date === value ? null : value,
    }));
  };

  const menuItems = [
    { id: 'account', label: 'Account', Icon: CreditCardIcon, Submenu: () => <AccountSubmenu selected={filters.account} onToggle={(v) => toggleArrayFilter('account', v)} /> },
    { id: 'type', label: 'Type', Icon: CryptocurrencyIcon, Submenu: () => <TypeSubmenu selected={filters.type} onToggle={(v) => toggleArrayFilter('type', v)} /> },
    { id: 'category', label: 'Category', Icon: PieChartIcon, Submenu: () => <CategorySubmenu selected={filters.category} onToggle={(v) => toggleArrayFilter('category', v)} onToggleMultiple={(v) => toggleMultipleValues('category', v)} /> },
    { id: 'date', label: 'Date', Icon: CalendarIcon, Submenu: () => <DateSubmenu selected={filters.date} onSelect={setDateFilter} /> },
    { id: 'recurring', label: 'Recurring', Icon: RefreshIcon, Submenu: () => <RecurringSubmenu selected={filters.recurring} onToggle={(v) => toggleArrayFilter('recurring', v)} /> },
  ];

  return (
    <DropdownMenu.Root open={isMainOpen} onOpenChange={setIsMainOpen}>
      <DropdownMenu.Trigger asChild>
        <div className="bg-[#191b1f] relative rounded-[8px] shrink-0">
          <button className="flex items-center px-[12px] py-[8px] h-[40px] relative cursor-pointer hover:bg-white/[0.04] transition-colors rounded-[8px]">
            <div className="size-[20px] flex items-center justify-center">
              <svg fill="none" viewBox="0 0 20 20" className="size-full">
                <path d="M2.5 5.83333H17.5M5.83333 10H14.1667M8.33333 14.1667H11.6667" stroke="#99A0AE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px]" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="end" sideOffset={8} className="z-50 w-[260px] animate-in fade-in zoom-in-95 duration-200 outline-none">
          <div className="bg-[#15161a] relative rounded-[12px] overflow-hidden border border-[#2e2f33] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)]">
            <div className="flex flex-col p-[12px]">
              <div className="px-[8px] py-[8px] mb-[4px]">
                <p className="font-['Inter_Tight',sans-serif] text-[14px] text-white font-semibold">Filter by</p>
              </div>

              <div className="flex flex-col w-full">
                {menuItems.map(({ id, label, Icon, Submenu }, idx) => (
                  <div key={id} className="flex flex-col w-full">
                    {idx > 0 && <Divider />}
                    <DropdownMenu.Sub>
                      <DropdownMenu.SubTrigger asChild>
                        <div className="flex items-center gap-[10px] py-[10px] px-[8px] w-full rounded-[8px] hover:bg-white/[0.04] transition-colors group cursor-pointer outline-none">
                          <Icon />
                          <span className="flex-1 text-left text-[#99A0AE] group-hover:text-white text-[14px] font-medium transition-colors">{label}</span>
                          <ChevronRightIcon />
                        </div>
                      </DropdownMenu.SubTrigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.SubContent sideOffset={12} className="z-[100] animate-in fade-in zoom-in-95 duration-200 outline-none">
                          <Submenu />
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Sub>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}