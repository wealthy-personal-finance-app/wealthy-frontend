import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, Plus, Calendar as CalendarIcon, ChevronDown, ChevronLeft, Check, X } from 'lucide-react';
import { TransactionType } from './HistoryView';
import { CategoryIcon } from './CategoryIcon';

export interface CategoryData {
  id: string;
  label: string;
  icon: string; // We'll map icons simply by name strings for now
  masterCategory: string;
}

const initialExpenseCategories: CategoryData[] = [
  { id: 'housing', label: 'Housing', icon: 'house', masterCategory: 'Essential Living' },
  { id: 'food', label: 'Food & Dining', icon: 'coffee', masterCategory: 'Essential Living' },
  { id: 'transportation', label: 'Transportation', icon: 'bus', masterCategory: 'Essential Living' },
  { id: 'utilities', label: 'Utilities', icon: 'zap', masterCategory: 'Essential Living' },
  { id: 'debt', label: 'Debt Payments', icon: 'credit-card', masterCategory: 'Obligations & Liabilities' },
  { id: 'insurance', label: 'Insurance', icon: 'shield', masterCategory: 'Obligations & Liabilities' },
  { id: 'taxes', label: 'Taxes', icon: 'taxes', masterCategory: 'Obligations & Liabilities' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film', masterCategory: 'Discretionary & Lifestyle' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping-cart', masterCategory: 'Discretionary & Lifestyle' },
  { id: 'travel', label: 'Travel & Vacations', icon: 'plane', masterCategory: 'Discretionary & Lifestyle' },
  { id: 'health', label: 'Health & Personal Care', icon: 'heart', masterCategory: 'Discretionary & Lifestyle' },
  { id: 'education', label: 'Education', icon: 'book', masterCategory: 'Growth & Giving' },
  { id: 'charity', label: 'Charity & Gifts', icon: 'gift', masterCategory: 'Growth & Giving' },
  { id: 'emergencies', label: 'Emergencies', icon: 'alert-triangle', masterCategory: 'Unplanned' },
  { id: 'misc', label: 'Miscellaneous', icon: 'more-horizontal', masterCategory: 'Unplanned' }
];

const initialIncomeCategories: CategoryData[] = [
  { id: 'salary', label: 'Salary/Wages', icon: 'wallet', masterCategory: 'Earned Income' },
  { id: 'bonus', label: 'Bonuses & Commissions', icon: 'award', masterCategory: 'Earned Income' },
  { id: 'freelance', label: 'Freelance/Side Hustle', icon: 'briefcase', masterCategory: 'Earned Income' },
  { id: 'rental-income', label: 'Rental Income', icon: 'home', masterCategory: 'Passive Income' },
  { id: 'dividends', label: 'Dividends & Interest', icon: 'trending-up', masterCategory: 'Passive Income' },
  { id: 'capital-gains', label: 'Capital Gains', icon: 'bar-chart-2', masterCategory: 'Portfolio Income' },
  { id: 'gifts-income', label: 'Gifts & Inheritances', icon: 'gift', masterCategory: 'Other Income' },
  { id: 'refunds', label: 'Refunds/Reimbursements', icon: 'refresh-ccw', masterCategory: 'Other Income' }
];

const initialAssetCategories: CategoryData[] = [
  { id: 'cash', label: 'Cash & Equivalents', icon: 'dollar-sign', masterCategory: 'Liquid Assets' },
  { id: 'bank', label: 'Bank Accounts', icon: 'landmark', masterCategory: 'Liquid Assets' },
  { id: 'stocks', label: 'Stocks', icon: 'trending-up', masterCategory: 'Investments' },
  { id: 'retirement', label: 'Retirement Accounts', icon: 'calendar', masterCategory: 'Investments' },
  { id: 'primary-residence', label: 'Primary Residence', icon: 'home', masterCategory: 'Real Estate' },
  { id: 'rental-prop', label: 'Rental Properties', icon: 'key', masterCategory: 'Real Estate' },
  { id: 'vehicles', label: 'Vehicles', icon: 'car', masterCategory: 'Personal Property' }
];

const initialLiabilityCategories: CategoryData[] = [
  { id: 'credit-cards', label: 'Credit Cards', icon: 'credit-card', masterCategory: 'Short-Term Liabilities' },
  { id: 'personal-loans', label: 'Personal Loans', icon: 'file-text', masterCategory: 'Short-Term Liabilities' },
  { id: 'mortgages', label: 'Mortgages', icon: 'home', masterCategory: 'Long-Term Liabilities' },
  { id: 'student-loans', label: 'Student Loans', icon: 'book', masterCategory: 'Long-Term Liabilities' },
  { id: 'auto-loans', label: 'Auto Loans', icon: 'car', masterCategory: 'Long-Term Liabilities' }
];

const masterCategoryOptions = [
  'Essential Living',
  'Obligations & Liabilities',
  'Discretionary & Lifestyle',
  'Growth & Giving',
  'Unplanned'
];

type AllowedTypes = 'Expense' | 'Income' | 'Asset' | 'Liability';

interface AddTransactionModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function AddTransactionModal({ onClose, onSave }: AddTransactionModalProps) {
  // Master State
  const [transactionType, setTransactionType] = useState<AllowedTypes>('Expense');
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation

  // Progressive disclosure view state
  const [viewState, setViewState] = useState<'main' | 'create-category'>('main');
  const [newMasterCategoryRef, setNewMasterCategoryRef] = useState<string | null>(null);

  // Focus ref for amount input
  const amountInputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewState === 'main') {
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
    }
  }, [viewState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Derived Categories based on type
  // (In a real app, this would be global state or a hook)
  const [allExpenseCats, setAllExpenseCats] = useState(initialExpenseCategories);
  const [allIncomeCats, setAllIncomeCats] = useState(initialIncomeCategories);
  const [allAssetCats, setAllAssetCats] = useState(initialAssetCategories);
  const [allLiabilityCats, setAllLiabilityCats] = useState(initialLiabilityCategories);

  const currentCategories =
    transactionType === 'Expense' ? allExpenseCats :
      transactionType === 'Income' ? allIncomeCats :
        transactionType === 'Asset' ? allAssetCats :
          allLiabilityCats;

  // Filter Categories
  const filteredCategories = currentCategories.filter(c =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleCategories = (searchQuery === '' && !showAllCategories)
    ? filteredCategories.slice(0, 6)
    : filteredCategories;

  // Grouping for rendering
  const groupedFiltered = visibleCategories.reduce((acc, cat) => {
    if (!acc[cat.masterCategory]) acc[cat.masterCategory] = [];
    acc[cat.masterCategory].push(cat);
    return acc;
  }, {} as Record<string, CategoryData[]>);

  const handleCreateCategorySubmit = () => {
    if (!newMasterCategoryRef || !searchQuery) return;

    const newCat: CategoryData = {
      id: searchQuery.toLowerCase().replace(/\s+/g, '-'),
      label: searchQuery,
      icon: 'star', // fallback icon
      masterCategory: newMasterCategoryRef
    };

    if (transactionType === 'Expense') setAllExpenseCats([...allExpenseCats, newCat]);
    else if (transactionType === 'Income') setAllIncomeCats([...allIncomeCats, newCat]);
    else if (transactionType === 'Asset') setAllAssetCats([...allAssetCats, newCat]);
    else setAllLiabilityCats([...allLiabilityCats, newCat]);

    setCategory(newCat.id);
    setViewState('main');
    setSearchQuery('');
  };

  const handleFinalSave = () => {
    const payload = {
      type: transactionType,
      amount,
      categoryId: category,
      date,
      note
    };
    onSave(payload);
  };

  // Close when clicking outside (simple backdrop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setDate(selectedDate.toISOString().split('T')[0]);
    setIsCalendarOpen(false);
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const days = Array.from({ length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] w-full max-w-[480px] p-[16px] flex flex-col gap-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in zoom-in-95 duration-200">

        {viewState === 'main' ? (
          <>
            <h2 className="text-white text-[14px] font-medium font-['Inter_Tight',sans-serif]">
              Add Transaction
            </h2>

            {/* Top Toggle */}
            <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[12px] p-[4px] flex gap-[4px]">
              {(['Expense', 'Income', 'Asset', 'Liability'] as AllowedTypes[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTransactionType(type);
                    setCategory(null); // reset category on type change
                    setShowAllCategories(false); // reset expanded state
                  }}
                  className={`flex-1 flex items-center justify-center py-[4px] px-[8px] rounded-[8px] transition-all duration-200 ${transactionType === type
                    ? 'bg-[rgba(65,63,63,0.5)] shadow-[0_1px_6px_0_rgba(14,18,27,0.08)]'
                    : 'hover:bg-[#2e2f33]/30'
                    }`}
                >
                  <span className={`text-[14px] font-['Inter_Tight',sans-serif] ${transactionType === type ? 'text-white font-medium' : 'text-[#717784]'}`}>
                    {type}
                  </span>
                </button>
              ))}
            </div>

            {/* Transaction Amount */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                Transaction Amount
              </label>
              <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid flex gap-[12px] items-center p-[20px] relative rounded-[12px] w-full focus-within:border-[#99a0ae] transition-colors shadow-[0_1px_2px_0_rgba(10,13,20,0.03)]">
                <span className="text-white font-['Inter_Tight',sans-serif] text-[18px] font-semibold">
                  LKR
                </span>
                <input
                  ref={amountInputRef}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent flex-1 font-['Inter_Tight',sans-serif] font-semibold text-[18px] text-white outline-none"
                  placeholder="0.00"
                  step="0.01"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            {/* Category Section Wrapper */}
            <div className="bg-[#15171A] border border-[#2e2f33] rounded-[12px] p-[12px] flex flex-col gap-[8px]">
              {/* Search Category */}
              <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] w-full focus-within:border-[#99a0ae] transition-colors">
                <Search size={16} className="text-[#99a0ae]" />
                <input
                  type="text"
                  placeholder="Search Category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 font-['Inter_Tight',sans-serif] font-normal text-[14px] text-[#717784] outline-none placeholder:text-[#717784]"
                  onFocus={(e) => e.target.select()}
                />
              </div>

              {/* Categories Grid or Create Button */}
              <div className="max-h-[300px] overflow-y-auto scrollbar-hide py-[4px] flex flex-col gap-[8px]">
                {visibleCategories.length > 0 ? (
                  showAllCategories || searchQuery !== '' ? (
                    // Grouped view
                    Object.entries(groupedFiltered).map(([masterCat, cats]) => (
                      <div key={masterCat} className="flex flex-col gap-[8px] w-full">
                        <span className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                          {masterCat}
                        </span>
                        <div className="grid grid-cols-3 gap-[12px] pb-[8px]">
                          {cats.map((c) => {
                            const isSelected = category === c.id;
                            return (
                              <button
                                key={c.id}
                                onClick={() => setCategory(c.id)}
                                className={`flex items-center p-[8px] rounded-[12px] border transition-all ${isSelected
                                  ? 'bg-[rgba(64,196,170,0.1)] border-[#40c4aa]'
                                  : 'bg-[#191b1f] border-[#2e2f33] hover:bg-[#2e2f33]/40'
                                  }`}
                              >
                                <div className="flex items-center gap-[8px] min-w-0">
                                  <div className={`w-[24px] h-[24px] rounded-[6px] shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#40c4aa]/20' : ''}`}>
                                    <CategoryIcon
                                      icon={c.icon}
                                      size={18}
                                      color={isSelected ? '#40c4aa' : '#99a0ae'}
                                    />
                                  </div>
                                  <span className={`text-[14px] font-['Inter_Tight',sans-serif] font-medium truncate ${isSelected ? 'text-white' : 'text-[#99a0ae]'}`}>
                                    {c.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Flat view for top 6 items
                    <div className="grid grid-cols-3 gap-[12px]">
                      {visibleCategories.map((c) => {
                        const isSelected = category === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setCategory(c.id)}
                            className={`flex items-center p-[8px] rounded-[12px] border transition-all ${isSelected
                              ? 'bg-[rgba(64,196,170,0.1)] border-[#40c4aa]'
                              : 'bg-[#191b1f] border-[#2e2f33] hover:bg-[#2e2f33]/40'
                              }`}
                          >
                            <div className="flex items-center gap-[8px] min-w-0">
                              <div className={`w-[24px] h-[24px] rounded-[6px] shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#40c4aa]/20' : ''}`}>
                                <CategoryIcon
                                  icon={c.icon}
                                  size={18}
                                  color={isSelected ? '#40c4aa' : '#99a0ae'}
                                />
                              </div>
                              <span className={`text-[14px] font-['Inter_Tight',sans-serif] font-medium truncate ${isSelected ? 'text-white' : 'text-[#99a0ae]'}`}>
                                {c.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => setViewState('create-category')}
                    className="w-full flex items-center gap-[8px] p-[12px] bg-[#191b1f] border border-dashed border-[#40c4aa] rounded-[12px] hover:bg-[#40c4aa]/10 transition-colors"
                  >
                    <Plus size={16} className="text-[#40c4aa]" />
                    <span className="text-[#40c4aa] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                      Create "{searchQuery}"
                    </span>
                  </button>
                )}
              </div>

              {searchQuery === '' && !showAllCategories && filteredCategories.length > 6 && (
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="flex items-center justify-start gap-[4px] mt-[4px] text-[#717784] hover:text-white transition-colors"
                >
                  <span className="text-[14px] font-medium font-['Inter_Tight',sans-serif]">See All Categories</span>
                  <ChevronRight size={16} />
                </button>
              )}

              {searchQuery === '' && showAllCategories && (
                <button
                  onClick={() => setViewState('create-category')}
                  className="flex items-center justify-start gap-[4px] mt-[4px] text-white hover:text-white/80 transition-colors"
                >
                  <span className="text-[16px] font-medium font-['Inter_Tight',sans-serif]">Create New Category</span>
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Date & Note Row */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[2px]">
                <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                  Date
                </label>
                <span className="text-[#df1c41]">*</span>
              </div>

              <div className="relative" ref={calendarRef}>
                <div
                  className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid flex gap-[12px] items-center justify-between px-[12px] py-[8px] relative ${isCalendarOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} w-full focus-within:border-[#99a0ae] transition-all cursor-pointer`}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <span className="font-['Inter_Tight',sans-serif] font-normal text-[14px] text-[#717784]">
                    {formatDateDisplay(date)}
                  </span>
                  <CalendarIcon size={16} className="text-[#99a0ae]" />
                </div>

                {isCalendarOpen && (
                  <div className="absolute top-[100%] left-0 right-0 z-[60] bg-[#15161a] border border-[#2e2f33] border-t-0 rounded-b-[16px] p-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-[12px]">
                      <button onClick={() => changeMonth(-1)} className="p-[4px] hover:bg-[#2e2f33]/40 rounded-full transition-colors text-[#99a0ae]">
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-white text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                        {monthName} {year}
                      </span>
                      <button onClick={() => changeMonth(1)} className="p-[4px] hover:bg-[#2e2f33]/40 rounded-full transition-colors text-[#99a0ae]">
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-[4px] mb-[4px]">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-[#717784] text-[10px] text-center font-medium uppercase">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-[4px]">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {days.map(d => {
                        const isToday = new Date().toISOString().split('T')[0] === new Date(year, viewDate.getMonth(), d).toISOString().split('T')[0];
                        const isSelected = date === new Date(year, viewDate.getMonth(), d).toISOString().split('T')[0];

                        return (
                          <button
                            key={d}
                            onClick={() => handleDateSelect(d)}
                            className={`h-[28px] text-[12px] flex items-center justify-center rounded-[6px] transition-all ${isSelected
                              ? 'bg-[#065f46] text-white'
                              : isToday
                                ? 'text-[#40c4aa] border border-[#40c4aa]/30'
                                : 'text-[#99a0ae] hover:bg-[#2e2f33]/60'
                              }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[2px]">
                <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                  Add note
                </label>
                <span className="text-[#717784] text-[12px]">(Optional)</span>
              </div>
              <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] w-full focus-within:border-[#99a0ae] transition-colors">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note"
                  className="bg-transparent flex-1 font-['Inter_Tight',sans-serif] font-normal text-[14px] text-[#717784] outline-none placeholder:text-[#717784]"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-[16px] mt-[8px]">
              <button
                onClick={onClose}
                className="px-[12px] py-[8px] border border-[#2e2f33] rounded-[8px] text-white text-[16px] font-medium font-['Inter_Tight',sans-serif] hover:bg-[#2e2f33]/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSave}
                disabled={!category || amount === '0' || amount === ''}
                className="px-[16px] py-[10px] bg-[#065f46] border border-[rgba(255,255,255,0.12)] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,91,85,0.48),0px_0px_0px_1px_#005b55] text-white text-[14px] font-semibold font-['Public_Sans',sans-serif] hover:bg-[#065f46]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {transactionType}
              </button>
            </div>

          </>
        ) : (
          /* Create Category View */
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-white text-[18px] font-medium font-['Inter_Tight',sans-serif]">
                Where does "{searchQuery}" belong?
              </h2>
            </div>

            <div className="flex flex-col gap-[12px] mt-[16px] overflow-y-auto max-h-[400px] scrollbar-hide py-[4px]">
              {masterCategoryOptions.map((masterOpt) => {
                const isSelected = newMasterCategoryRef === masterOpt;
                return (
                  <button
                    key={masterOpt}
                    onClick={() => setNewMasterCategoryRef(masterOpt)}
                    className={`flex items-center justify-between p-[16px] rounded-[12px] border transition-all ${isSelected
                      ? 'bg-[rgba(64,196,170,0.1)] border-[#40c4aa]'
                      : 'bg-[#191b1f] border-[#2e2f33] hover:bg-[#2e2f33]/40'
                      }`}
                  >
                    <span className={`text-[16px] font-['Inter_Tight',sans-serif] font-medium ${isSelected ? 'text-[#40c4aa]' : 'text-[#99a0ae]'}`}>
                      {masterOpt}
                    </span>
                    {isSelected && <div className="w-[8px] h-[8px] rounded-full bg-[#40c4aa]"></div>}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-end gap-[16px] mt-[16px]">
              <button
                onClick={() => {
                  setViewState('main');
                  setNewMasterCategoryRef(null);
                }}
                className="px-[12px] py-[8px] border border-[#2e2f33] rounded-[8px] text-white text-[14px] font-medium font-['Inter_Tight',sans-serif] hover:bg-[#2e2f33]/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategorySubmit}
                disabled={!newMasterCategoryRef}
                className="px-[16px] py-[10px] bg-[#065f46] border border-white/10 rounded-[8px] text-white text-[14px] font-semibold font-['Inter_Tight',sans-serif] hover:bg-[#065f46]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
