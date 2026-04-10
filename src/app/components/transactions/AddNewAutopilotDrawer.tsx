import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus, ChevronRight, X, Check } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { toast } from 'sonner';
import {
  initialExpenseCategories,
  initialIncomeCategories,
  initialAssetCategories,
  initialLiabilityCategories,
  CategoryData
} from './AddTransactionModal';
import { WeeklySelector, MonthlySelector, YearlySelector } from './ScheduleSelectors';

interface AddNewAutopilotDrawerProps {
  onClose: () => void;
}

export function AddNewAutopilotDrawer({ onClose }: AddNewAutopilotDrawerProps) {
  const [autopilotData, setAutopilotData] = useState({
    transactionType: 'Expense',
    amount: '',
    flowName: '',
    category: '',
    scheduleFrequency: 'Daily',
    scheduleConfig: {} as any,
    note: '',
    icon: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categoryViewState, setCategoryViewState] = useState<'list' | 'create'>('list');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const scheduleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScheduleOpen) {
      setTimeout(() => {
        scheduleMenuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [isScheduleOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isScheduleOpen && scheduleRef.current && !scheduleRef.current.contains(event.target as Node)) {
        setIsScheduleOpen(false);
      }
      if (isCategoryOpen && categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isScheduleOpen, isCategoryOpen]);

  // Categories logic based on type
  const [allExpenseCats, setAllExpenseCats] = useState(initialExpenseCategories);
  const [allIncomeCats, setAllIncomeCats] = useState(initialIncomeCategories);
  const [allAssetCats, setAllAssetCats] = useState(initialAssetCategories);
  const [allLiabilityCats, setAllLiabilityCats] = useState(initialLiabilityCategories);

  const currentCategories =
    autopilotData.transactionType === 'Expense' ? allExpenseCats :
      autopilotData.transactionType === 'Income' ? allIncomeCats :
        autopilotData.transactionType === 'Asset' ? allAssetCats :
          allLiabilityCats;

  const filteredCategories = currentCategories.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const visibleCategories = (!showAllCategories && searchQuery === '')
    ? filteredCategories.slice(0, 6)
    : filteredCategories;

  const groupedFiltered = visibleCategories.reduce((acc, cat) => {
    if (!acc[cat.masterCategory]) acc[cat.masterCategory] = [];
    acc[cat.masterCategory].push(cat);
    return acc;
  }, {} as Record<string, CategoryData[]>);

  const masterCategoryOptions = Array.from(new Set(currentCategories.map(c => c.masterCategory)));

  const handleCreateCategory = (masterCat: string) => {
    const newCat: CategoryData = {
      id: newCategoryLabel.toLowerCase().replace(/\s+/g, '-'),
      label: newCategoryLabel,
      icon: 'star',
      masterCategory: masterCat
    };

    if (autopilotData.transactionType === 'Expense') setAllExpenseCats([...allExpenseCats, newCat]);
    else if (autopilotData.transactionType === 'Income') setAllIncomeCats([...allIncomeCats, newCat]);
    else if (autopilotData.transactionType === 'Asset') setAllAssetCats([...allAssetCats, newCat]);
    else setAllLiabilityCats([...allLiabilityCats, newCat]);

    setAutopilotData({
      ...autopilotData,
      category: newCategoryLabel,
      icon: 'star'
    });
    setCategoryViewState('list');
    setSearchQuery('');
    setShowAllCategories(false);

    toast.success(`Category "${newCategoryLabel}" created in ${masterCat}`);
  };

  const types = ['Expense', 'Income', 'Asset', 'Liability'];
  const schedules = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  const isFormValid = autopilotData.transactionType &&
    autopilotData.amount !== '' &&
    autopilotData.flowName !== '' &&
    autopilotData.category !== '';

  const handleSubmit = () => {
    if (!isFormValid) return;
    console.log('Submitting new Autopilot Flow payload:', JSON.stringify(autopilotData, null, 2));
    toast.success(`Autopilot flow "${autopilotData.flowName}" created successfully!`);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-[#0e121b]/40 z-[100]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[515px] bg-[#191b1f] border-l border-[#2e2f33] z-[110] flex flex-col shadow-[-10px_0_100px_rgba(10,10,57,0.15)] animate-in slide-in-from-right duration-300">

        {/* Header content wrapper to give scrolling capability */}
        <div className="flex-1 overflow-hidden flex flex-col p-[24px] gap-[12px]">

          {/* Fixed Area: Header and Type Toggle */}
          <div className="flex flex-col gap-[12px] shrink-0">
            <div className="flex justify-between items-center w-full shrink-0">
              <p className="text-[16px] text-white font-['Inter_Tight',sans-serif]">
                <span className="font-medium">Add </span>
                <span className="font-bold">New Autopilot Flow</span>
              </p>
              <button onClick={onClose} className="p-[4px] hover:bg-[#2e2f33] rounded-full transition-colors text-[#717784] hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="bg-[#191b1f] border border-[#2e2f33] p-[4px] rounded-[12px] flex gap-[4px] shrink-0 w-full">
              {types.map(t => (
                <div
                  key={t}
                  onClick={() => setAutopilotData({ ...autopilotData, transactionType: t, category: '' })}
                  className={`flex-1 py-[4px] flex items-center justify-center gap-[8px] rounded-[8px] cursor-pointer transition-all ${autopilotData.transactionType === t
                    ? 'bg-[rgba(65,63,63,0.5)] shadow-[0px_1px_6px_0px_rgba(14,18,27,0.08)]'
                    : 'bg-transparent hover:bg-[#2e2f33]/30'
                    }`}
                >
                  <p className={`font-['Inter_Tight',sans-serif] ${autopilotData.transactionType === t ? 'font-medium text-white' : 'font-normal text-[#717784]'} text-[16px] text-center`}>
                    {t}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Area: All other fields */}
          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-[12px]">


            {/* Transaction Amount */}
            <div className="flex flex-col gap-[8px] shrink-0">
              <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px] text-[#717784]">Transaction Amount</p>
              <div className="bg-[#131417] border border-[#2e2f33] h-[68px] rounded-[12px] flex items-center px-[20px] shadow-inner focus-within:border-[#99a0ae] transition-colors">
                <p className="font-['Inter_Tight',sans-serif] font-semibold text-[18px] text-white">LKR</p>
                <input
                  type="number"
                  value={autopilotData.amount}
                  onChange={(e) => setAutopilotData({ ...autopilotData, amount: e.target.value })}
                  placeholder="0.00"
                  className="bg-transparent border-none outline-none font-['Inter_Tight',sans-serif] font-semibold text-[18px] text-white ml-[8px] flex-1"
                />
              </div>
            </div>

            {/* Flow Name */}
            <div className="flex flex-col gap-[4px] shrink-0">
              <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px] text-[#717784]">Flow Name</p>
              <div className="bg-[#131417] border border-[#2e2f33] h-[40px] px-[12px] rounded-[8px] flex items-center focus-within:border-[#99a0ae] transition-colors">
                <input
                  type="text"
                  value={autopilotData.flowName}
                  onChange={(e) => setAutopilotData({ ...autopilotData, flowName: e.target.value })}
                  placeholder="e.g. Apartment Rent"
                  className="bg-transparent border-none outline-none font-['Inter_Tight',sans-serif] text-[14px] text-white flex-1"
                />
              </div>
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-[4px] shrink-0">
              <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px] text-[#717784]">Category</p>
              <div className="relative w-full" ref={categoryRef}>
                <div
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`bg-[#131417] border border-[#2e2f33] h-[40px] px-[12px] flex items-center justify-between relative ${isCategoryOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer shadow-inner`}
                >
                  <div className="flex items-center gap-[12px]">
                    {autopilotData.category ? (
                      <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                        <CategoryIcon
                          icon={currentCategories.find(c => c.label === autopilotData.category)?.icon || 'star'}
                          size={18}
                          color="#99a0ae"
                        />
                      </div>
                    ) : (
                      <div className="w-[24px] h-[24px] rounded-full border border-dashed border-[#2e2f33] shrink-0" />
                    )}
                    <span className={`font-['Inter_Tight',sans-serif] font-medium text-[14px] ${autopilotData.category ? 'text-white' : 'text-[#717784]'}`}>
                      {autopilotData.category || 'Select Category'}
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
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Search Category"
                            className="bg-transparent flex-1 font-['Inter_Tight',sans-serif] font-medium text-[14px] leading-[18px] text-[#99a0ae] outline-none placeholder:text-[#99a0ae]"
                          />
                        </div>

                        <div className="w-full flex-col flex max-h-[300px] overflow-y-auto scrollbar-hide">
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
                                  <div className="py-[6px] w-full">
                                    <span className="text-[#717784] font-['Inter_Tight',sans-serif] font-medium text-[14px] leading-[18px]">
                                      {masterCat}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-[6px] items-start w-full">
                                    {cats.map((c, index) => (
                                      <React.Fragment key={c.id}>
                                        {index !== 0 && <div className="h-px bg-[#2e2f33] w-full" />}
                                        <div
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setAutopilotData({
                                              ...autopilotData,
                                              category: c.label,
                                              icon: c.icon
                                            });
                                            setIsCategoryOpen(false);
                                            setSearchQuery('');
                                          }}
                                          className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[12px] cursor-pointer hover:bg-white/[0.04] transition-colors w-full"
                                        >
                                          <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                                            <CategoryIcon icon={c.icon} size={20} color="#99a0ae" />
                                          </div>
                                          <span className="text-[14px] text-[#99a0ae] font-['Inter_Tight',sans-serif] font-normal leading-[18px]">
                                            {c.label}
                                          </span>
                                        </div>
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              {searchQuery === '' && (
                                <div className="flex justify-start px-[8px] py-[4px] mt-[8px]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewCategoryLabel('');
                                      setCategoryViewState('create');
                                    }}
                                    className="flex items-center justify-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                                  >
                                    <span className="font-['Inter_Tight',sans-serif] font-medium text-[16px] leading-[24px] text-white whitespace-nowrap">Create New Category</span>
                                    <ChevronRight size={20} className="text-white" />
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewCategoryLabel(searchQuery);
                                setCategoryViewState('create');
                              }}
                              className="w-full flex items-center gap-[8px] py-[8px] px-[12px] bg-[#191b1f] border border-dashed border-[#40c4aa] rounded-[12px] hover:bg-[#40c4aa]/10 transition-colors mt-[8px] cursor-pointer"
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
                                className={`flex items-center justify-between px-[12px] py-[8px] rounded-[6px] transition-all font-['Inter_Tight',sans-serif] text-[13px] text-left cursor-pointer ${selectedMasterCategory === masterOpt
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

            {/* Schedule */}
            <div className="flex flex-col gap-[4px] shrink-0 z-50">
              <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px] text-[#717784]">Schedule</p>
              <div className="relative" ref={scheduleRef}>
                <div
                  onClick={() => {
                    const newOpen = !isScheduleOpen;
                    setIsScheduleOpen(newOpen);
                    if (newOpen) {
                      setTimeout(() => {
                        scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }, 100);
                    }
                  }}
                  className={`bg-[#131417] border border-[#2e2f33] ${isScheduleOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} h-[40px] px-[12px] flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
                >
                  <span className="text-[14px] text-white font-['Inter_Tight',sans-serif]">
                    {autopilotData.scheduleFrequency}
                  </span>
                  <ChevronDown size={20} className={`text-[#99a0ae] transition-transform ${isScheduleOpen ? 'rotate-180' : ''}`} />
                </div>

                {isScheduleOpen && (
                  <div
                    ref={scheduleMenuRef}
                    className="absolute top-[100%] left-0 right-0 border border-[#2e2f33] border-t-0 p-[8px] rounded-b-[8px] bg-[#15171a] shadow-xl z-[100] animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] p-[4px] flex flex-col gap-[4px]">
                      {schedules.map(freq => (
                        <div
                          key={freq}
                          onClick={() => {
                            setAutopilotData({
                              ...autopilotData,
                              scheduleFrequency: freq,
                              scheduleConfig: freq === 'Weekly' ? ['1'] : freq === 'Monthly' ? '1st' : freq === 'Yearly' ? { month: 'January', day: '1st' } : {}
                            });
                            setIsScheduleOpen(false);
                          }}
                          className={`p-[8px] cursor-pointer rounded-[6px] font-['Inter_Tight',sans-serif] text-[14px] transition-colors ${autopilotData.scheduleFrequency === freq
                            ? 'bg-[#2e2f33] text-white'
                            : 'bg-transparent text-[#99a0ae] hover:bg-[#2e2f33]/40 hover:text-white'
                            }`}
                        >
                          {freq}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Schedule Component */}
              {autopilotData.scheduleFrequency === 'Weekly' && (
                <div className="mt-[8px]">
                  <WeeklySelector
                    value={Array.isArray(autopilotData.scheduleConfig) ? autopilotData.scheduleConfig : []}
                    onChange={(days) => setAutopilotData({ ...autopilotData, scheduleConfig: days })}
                  />
                </div>
              )}

              {autopilotData.scheduleFrequency === 'Monthly' && (
                <div className="mt-[8px]">
                  <MonthlySelector
                    value={typeof autopilotData.scheduleConfig === 'string' ? autopilotData.scheduleConfig : ''}
                    onChange={(day) => setAutopilotData({ ...autopilotData, scheduleConfig: day })}
                  />
                </div>
              )}

              {autopilotData.scheduleFrequency === 'Yearly' && (
                <div className="mt-[8px]">
                  <YearlySelector
                    value={autopilotData.scheduleConfig || {}}
                    onChange={(config) => setAutopilotData({ ...autopilotData, scheduleConfig: config })}
                  />
                </div>
              )}
            </div>

            {/* Note */}
            <div className="flex flex-col gap-[4px] shrink-0 mb-[16px]">
              <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px] text-[#717784]">Note</p>
              <div className="bg-[#131417] border border-[#2e2f33] h-[40px] px-[12px] rounded-[8px] flex items-center focus-within:border-[#99a0ae] transition-colors">
                <input
                  type="text"
                  value={autopilotData.note}
                  onChange={(e) => setAutopilotData({ ...autopilotData, note: e.target.value })}
                  placeholder="Add a note"
                  className="bg-transparent border-none outline-none font-['Inter_Tight',sans-serif] text-[14px] text-white flex-1"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-[24px] border-t border-[#2e2f33] shrink-0 flex gap-[16px] pb-[40px]">
          <button
            onClick={onClose}
            className="flex-1 py-[10px] rounded-[8px] border border-[#2e2f33] text-white font-['Inter_Tight',sans-serif] font-medium text-[16px] hover:bg-[#2e2f33]/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`flex-1 py-[10px] rounded-[8px] bg-[#065f46] border border-[#ffffff1f] shadow-[0px_1px_2px_rgba(0,91,85,0.48),0px_0px_0px_1px_#005b55] text-white font-['Public_Sans',sans-serif] font-semibold text-[14px] transition-all ${isFormValid ? 'hover:bg-[#087f5b] cursor-pointer' : 'opacity-40 cursor-not-allowed grayscale-[0.2]'
              }`}
          >
            Create Flow
          </button>
        </div>

      </div>
    </>
  );
}
