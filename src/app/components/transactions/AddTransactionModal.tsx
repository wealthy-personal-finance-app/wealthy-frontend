import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, Plus, Calendar as CalendarIcon, ChevronDown, ChevronLeft, Check, X } from 'lucide-react';
import { TransactionType } from './HistoryView';
import { CategoryIcon } from './CategoryIcon';
import { toast } from 'sonner';

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
  const [transactionName, setTransactionName] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation

  // Category view inside dropdown
  const [categoryViewState, setCategoryViewState] = useState<'list' | 'create'>('list');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<string | null>(null);

  // Focus ref for amount input
  const amountInputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const categorySearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (amountInputRef.current) {
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (isCategoryOpen) {
      setTimeout(() => {
        categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        categorySearchRef.current?.focus();
      }, 300); // Slightly longer delay to allow modal layout to settle
    }
  }, [isCategoryOpen]);

  useEffect(() => {
    if (isCalendarOpen) {
      setTimeout(() => {
        calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isCalendarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen, isCategoryOpen]);

  // Derived Categories based on type
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

  const handleCreateCategory = (masterCat: string) => {
    const label = newCategoryLabel || searchQuery;
    if (!label) return;

    const newCat: CategoryData = {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label: label,
      icon: 'star',
      masterCategory: masterCat
    };

    if (transactionType === 'Expense') setAllExpenseCats([...allExpenseCats, newCat]);
    else if (transactionType === 'Income') setAllIncomeCats([...allIncomeCats, newCat]);
    else if (transactionType === 'Asset') setAllAssetCats([...allAssetCats, newCat]);
    else setAllLiabilityCats([...allLiabilityCats, newCat]);

    setCategory(newCat.label);
    setCategoryViewState('list');
    setIsCategoryOpen(false);
    setSearchQuery('');
    toast.success(`Category "${label}" created successfully`);
  };

  const handleFinalSave = () => {
    const payload = {
      type: transactionType,
      amount,
      name: transactionName,
      category: category,
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
      className="fixed inset-0 z-50 flex justify-center items-center p-[24px] bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] w-full max-w-[540px] max-h-full p-[24px] flex flex-col gap-[20px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="flex items-center justify-between">
          <h2 className="text-white text-[18px] font-semibold font-['Inter_Tight',sans-serif]">
            Add Transaction
          </h2>
          <button onClick={onClose} className="p-[4px] hover:bg-[#2e2f33] rounded-full transition-colors">
            <X size={20} className="text-[#717784]" />
          </button>
        </div>

        {/* Top Toggle */}
        <div className="bg-[#131417] border border-[#2e2f33] rounded-[12px] p-[4px] flex gap-[4px] shrink-0">
          {(['Expense', 'Income', 'Asset', 'Liability'] as AllowedTypes[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setTransactionType(type);
                setCategory(null);
                setCategoryViewState('list');
              }}
              className={`flex-1 flex items-center justify-center py-[6px] px-[8px] rounded-[8px] transition-all duration-200 ${transactionType === type
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

        <div className={`flex-1 min-h-0 flex flex-col gap-[16px] overflow-y-auto pr-[4px] scrollbar-hide transition-all duration-300 ${(isCategoryOpen || isCalendarOpen) ? 'pb-[240px]' : 'pb-[8px]'}`}>
          {/* Transaction Amount */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
              Transaction Amount
            </label>
            <div className="bg-[#131417] border border-[#2e2f33] flex gap-[12px] items-center p-[20px] relative rounded-[12px] w-full focus-within:border-[#99a0ae] transition-colors shadow-inner">
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
              />
            </div>
          </div>

          {/* Transaction Name field */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
              Transaction Name
            </label>
            <div className="bg-[#131417] border border-[#2e2f33] py-[8px] px-[12px] rounded-[8px] focus-within:border-[#99a0ae] transition-colors">
              <input 
                type="text"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                placeholder="e.g. Lunch with friends"
                className="bg-transparent w-full outline-none text-white font-['Inter_Tight',sans-serif] text-[16px]"
              />
            </div>
          </div>

          {/* Category selection */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
              Category
            </label>
            <div className="relative w-full" ref={categoryRef}>
              <div 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`bg-[#131417] border border-[#2e2f33] h-[40px] px-[12px] flex items-center justify-between relative ${isCategoryOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer shadow-inner`}
              >
                <div className="flex items-center gap-[12px]">
                  {category ? (
                    <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                      <CategoryIcon 
                        icon={currentCategories.find(c => c.label === category)?.icon || 'star'} 
                        size={18} 
                        color="#99a0ae" 
                      />
                    </div>
                  ) : (
                    <div className="w-[24px] h-[24px] rounded-full border border-dashed border-[#2e2f33] shrink-0" />
                  )}
                  <span className={`font-['Inter_Tight',sans-serif] font-medium text-[16px] ${category ? 'text-white' : 'text-[#717784]'}`}>
                    {category || 'Select Category'}
                  </span>
                </div>
                <ChevronDown color="#717784" size={20} className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </div>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 z-[100] bg-[#15171a] border border-[#2e2f33] border-solid border-t-0 flex flex-col items-start overflow-clip pb-[24px] pt-[16px] px-[16px] rounded-b-[16px] rounded-t-none shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in slide-in-from-top-1 duration-200">
                  {categoryViewState === 'list' ? (
                    <>
                      <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] h-[40px] px-[8px] flex items-center gap-[4px] w-full mb-[8px] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)]">
                        <Search size={16} className="text-[#99a0ae] shrink-0" />
                        <input 
                          ref={categorySearchRef}
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Search Category" 
                          className="bg-transparent flex-1 font-['Inter_Tight',sans-serif] font-medium text-[14px] leading-[18px] text-[#99a0ae] outline-none placeholder:text-[#99a0ae]"
                        />
                      </div>
                      
                      <div className="w-full flex-col flex max-h-[260px] overflow-y-auto scrollbar-hide">
                        {filteredCategories.length > 0 ? (
                          <>
                            {Object.entries(
                              filteredCategories.reduce((acc, cat) => {
                                if (!acc[cat.masterCategory]) acc[cat.masterCategory] = [];
                                acc[cat.masterCategory].push(cat);
                                return acc;
                              }, {} as Record<string, CategoryData[]>)
                            ).map(([masterCat, cats]) => (
                              <div key={masterCat} className="flex flex-col items-start w-full gap-[6px]">
                                <div className="py-[6px] w-full border-b border-[#2e2f33] mb-[6px]">
                                  <span className="text-[#717784] font-['Inter_Tight',sans-serif] font-medium text-[12px] leading-[18px] uppercase tracking-wider">
                                    {masterCat}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-[4px] items-start w-full">
                                  {cats.map((c, index) => (
                                    <React.Fragment key={c.id}>
                                      {index !== 0 && <div className="h-px bg-[#2e2f33] w-full" />}
                                      <div 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCategory(c.label);
                                          setIsCategoryOpen(false);
                                          setSearchQuery('');
                                        }}
                                        className="flex items-center gap-[10px] px-[12px] py-[8px] rounded-[10px] cursor-pointer hover:bg-white/[0.04] transition-colors w-full"
                                      >
                                        <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                                          <CategoryIcon icon={c.icon} size={18} color="#99a0ae" />
                                        </div>
                                        <span className="text-[14px] text-white font-['Inter_Tight',sans-serif] font-medium">
                                          {c.label}
                                        </span>
                                      </div>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {searchQuery === '' && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNewCategoryLabel('');
                                  setCategoryViewState('create');
                                }}
                                className="flex items-center gap-[4px] mt-[12px] px-[8px] py-[4px] text-white hover:opacity-80 transition-opacity font-['Inter_Tight',sans-serif] font-medium text-[14px]"
                              >
                                <span>Create New Category</span>
                                <ChevronRight size={16} />
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewCategoryLabel(searchQuery);
                              setCategoryViewState('create');
                            }}
                            className="w-full flex items-center gap-[8px] p-[12px] bg-[#191b1f] border border-dashed border-[#40c4aa] rounded-[12px] hover:bg-[#40c4aa]/10 transition-colors mt-[8px] cursor-pointer"
                          >
                            <Plus size={16} className="text-[#40c4aa]" />
                            <span className="text-[#40c4aa] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                              Create "{searchQuery}"
                            </span>
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex flex-col gap-[16px]">
                      {/* Name of Category */}
                      <div className="flex flex-col gap-[8px]">
                        <label className="text-[#717784] text-[10px] font-bold font-['Inter_Tight',sans-serif] uppercase tracking-wider">
                          Name of Category
                        </label>
                        <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] h-[40px] px-[12px] flex items-center shadow-inner focus-within:border-[#99a0ae] transition-colors">
                          <input 
                            type="text" 
                            value={newCategoryLabel} 
                            onChange={(e) => setNewCategoryLabel(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Category Name"
                            className="bg-transparent flex-1 text-white font-['Inter_Tight',sans-serif] text-[14px] outline-none placeholder:text-[#2e2f33]"
                          />
                        </div>
                      </div>

                      {/* Choose Main Category */}
                      <div className="flex flex-col gap-[8px]">
                        <label className="text-[#717784] text-[10px] font-bold font-['Inter_Tight',sans-serif] uppercase tracking-wider">
                          Choose Main Category
                        </label>
                        <div className="flex flex-col gap-[2px] max-h-[160px] overflow-y-auto scrollbar-hide border border-[#2e2f33] rounded-[8px] bg-[#131417] p-[4px] shadow-inner">
                          {masterCategoryOptions.map((masterOpt) => (
                            <button
                              key={masterOpt}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMasterCategory(masterOpt);
                              }}
                              className={`flex items-center justify-between px-[12px] py-[8px] rounded-[6px] transition-all font-['Inter_Tight',sans-serif] text-[13px] text-left cursor-pointer ${
                                selectedMasterCategory === masterOpt 
                                  ? 'bg-[#2e2f33] text-white font-medium shadow-sm' 
                                  : 'text-[#99a0ae] hover:bg-white/[0.04]'
                              }`}
                            >
                              <span>{masterOpt}</span>
                              {selectedMasterCategory === masterOpt && (
                                <Check size={14} className="text-[#40c4aa] shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex gap-[8px] pt-[8px]">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryViewState('list');
                            setSelectedMasterCategory(null);
                          }}
                          className="flex-1 py-[8px] rounded-[8px] border border-[#2e2f33] text-[#717784] text-[13px] font-medium font-['Inter_Tight',sans-serif] hover:bg-[#2e2f33]/40 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled={!newCategoryLabel.trim() || !selectedMasterCategory}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedMasterCategory) handleCreateCategory(selectedMasterCategory);
                          }}
                          className="flex-1 py-[8px] rounded-[8px] bg-[#065f46] text-white text-[13px] font-semibold font-['Inter_Tight',sans-serif] hover:bg-[#087f5b] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                        >
                          Create Category
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
              Date
            </label>
            <div className="relative" ref={calendarRef}>
              <div
                className={`bg-[#131417] border border-[#2e2f33] flex items-center justify-between px-[12px] h-[40px] relative ${isCalendarOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} w-full focus-within:border-[#99a0ae] transition-all cursor-pointer shadow-inner`}
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <span className="font-['Inter_Tight',sans-serif] text-[15px] text-white">
                  {formatDateDisplay(date)}
                </span>
                <CalendarIcon size={18} className="text-[#99a0ae]" />
              </div>

              {isCalendarOpen && (
                <div className="absolute top-[100%] left-0 right-0 z-[60] bg-[#15161a] border border-[#2e2f33] border-t-0 rounded-b-[16px] p-[16px] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-[12px]">
                    <button onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} className="p-[4px] hover:bg-[#2e2f33] rounded-full text-[#99a0ae]">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-white text-[14px] font-medium">
                      {monthName} {year}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); changeMonth(1); }} className="p-[4px] hover:bg-[#2e2f33] rounded-full text-[#99a0ae]">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-[2px] mb-[4px]">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <div key={d} className="text-[#717784] text-[10px] text-center font-medium">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-[2px]">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
                    {days.map(d => {
                      const isSelected = date === new Date(year, viewDate.getMonth(), d).toISOString().split('T')[0];
                      return (
                        <button
                          key={d}
                          onClick={(e) => { e.stopPropagation(); handleDateSelect(d); }}
                          className={`h-[28px] text-[12px] flex items-center justify-center rounded-[6px] transition-all ${isSelected ? 'bg-[#40c4aa] text-black font-semibold' : 'text-[#99a0ae] hover:bg-[#2e2f33]'}`}
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

          {/* Note */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
              Note (Optional)
            </label>
            <div className="bg-[#131417] border border-[#2e2f33] h-[40px] px-[12px] rounded-[8px] flex items-center focus-within:border-[#99a0ae] transition-colors shadow-inner">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Memo"
                className="bg-transparent w-full outline-none text-white font-['Inter_Tight',sans-serif] text-[15px]"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-[12px] pt-[8px]">
          <button
            onClick={onClose}
            className="flex-1 py-[12px] border border-[#2e2f33] rounded-[12px] text-white text-[16px] font-medium font-['Inter_Tight',sans-serif] hover:bg-[#2e2f33]/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalSave}
            disabled={!category || !amount || amount === '0' || !transactionName}
            className="flex-1 py-[12px] bg-[#065f46] border border-white/10 rounded-[12px] shadow-lg text-white text-[16px] font-semibold font-['Inter_Tight',sans-serif] hover:bg-[#087f5b] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add {transactionType}
          </button>
        </div>

      </div>
    </div>
  );
}
