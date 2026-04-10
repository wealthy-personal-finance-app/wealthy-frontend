import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus, ChevronRight, X } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
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
    note: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categoryViewState, setCategoryViewState] = useState<'list' | 'create'>('list');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isScheduleOpen]);

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

    setAutopilotData({ ...autopilotData, category: newCategoryLabel });
    setCategoryViewState('list');
    setSearchQuery('');
    setShowAllCategories(false);

    setFeedback(`Category "${newCategoryLabel}" created in ${masterCat}`);
    setTimeout(() => setFeedback(null), 3000);
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
    setFeedback('Autopilot flow created successfully!');
    setTimeout(() => {
      onClose();
    }, 1500);
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
            <div className="flex flex-col gap-[8px] shrink-0">
              <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px] text-[#717784]">Flow Name</p>
              <div className="bg-[#131417] border border-[#2e2f33] p-[12px] rounded-[8px] flex items-center focus-within:border-[#99a0ae] transition-colors">
                <input
                  type="text"
                  value={autopilotData.flowName}
                  onChange={(e) => setAutopilotData({ ...autopilotData, flowName: e.target.value })}
                  placeholder="e.g. Apartment Rent"
                  className="bg-transparent border-none outline-none font-['Inter_Tight',sans-serif] text-[16px] text-white flex-1"
                />
              </div>
            </div>

            {/* Category Section */}
            <div id="category-section-container" className={`border border-[#2e2f33] rounded-[12px] p-[12px] flex flex-col gap-[12px] shrink-0 transition-all duration-300 relative bg-[#191b1f] ${showAllCategories ? 'flex-1 min-h-0' : ''}`}>
              {/* Feedback Popover */}
              {feedback && (
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 bg-[#065f46] text-white px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium z-50 animate-in fade-in slide-in-from-top-2 whitespace-nowrap shadow-lg">
                  {feedback}
                </div>
              )}

              {categoryViewState === 'list' ? (
                <>
                  <div className="bg-[#191b1f] border border-[#2e2f33] h-[40px] rounded-[8px] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)] flex items-center px-[12px] gap-[8px] focus-within:border-[#99a0ae] transition-colors">
                    <Search size={16} className="text-[#99a0ae]" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Category"
                      className="bg-transparent border-none outline-none font-['Inter_Tight',sans-serif] text-[14px] text-white flex-1"
                    />
                  </div>

                  {/* Render Categories */}
                  <div className={`transition-all duration-300 ease-in-out flex-1 flex flex-col min-h-0`}>
                    {showAllCategories || searchQuery !== '' ? (
                      // Full List / Search Results
                      <div className="flex flex-col gap-[6px] flex-1 overflow-y-auto scrollbar-hide py-[4px]">
                        {Object.keys(groupedFiltered).length > 0 ? (
                          Object.entries(groupedFiltered).map(([masterCat, cats]) => (
                            <div key={masterCat} className="flex flex-col w-full gap-[6px]">
                              <div className="py-[6px] w-full">
                                <span className="text-[#717784] text-[14px] font-medium font-['Inter_Tight',sans-serif]">
                                  {masterCat}
                                </span>
                              </div>
                              <div className="flex flex-col gap-[6px]">
                                {cats.map((c, idx) => {
                                  const isSelected = autopilotData.category === c.label;
                                  return (
                                    <React.Fragment key={c.id}>
                                      {idx !== 0 && <div className="h-px bg-[#2e2f33] w-full" />}
                                      <div
                                        onClick={() => setAutopilotData({ ...autopilotData, category: c.label })}
                                        className={`flex items-center px-[12px] py-[6px] rounded-[12px] cursor-pointer transition-colors ${isSelected ? 'bg-[#2e2f33]' : 'hover:bg-white/[0.04]'}`}
                                      >
                                        <div className="flex items-center gap-[8px] w-full">
                                          <div className="w-[24px] h-[24px] shrink-0 flex items-center justify-center relative">
                                            <CategoryIcon icon={c.icon} size={18} color={isSelected ? '#40c4aa' : '#99a0ae'} />
                                          </div>
                                          <span className={`text-[14px] font-['Inter_Tight',sans-serif] ${isSelected ? 'text-white font-medium' : 'text-[#99a0ae]'}`}>
                                            {c.label}
                                          </span>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-[24px] px-[16px] text-center gap-[12px]">
                            <p className="text-[#99a0ae] text-[14px] font-['Inter_Tight',sans-serif]">Can't find "{searchQuery}"</p>
                            <button
                              onClick={() => {
                                setNewCategoryLabel(searchQuery);
                                setCategoryViewState('create');
                              }}
                              className="bg-transparent border border-[#2e2f33] hover:bg-[#2e2f33]/40 text-white rounded-[8px] py-[6px] px-[12px] transition-colors flex items-center justify-center gap-[8px] w-full"
                            >
                              <Plus size={16} />
                              <span className="font-['Inter_Tight',sans-serif] text-[14px]">Create "{searchQuery}"</span>
                            </button>
                          </div>
                        )}
                        {showAllCategories && searchQuery === '' && (
                          <button
                            onClick={() => {
                              setNewCategoryLabel('');
                              setCategoryViewState('create');
                            }}
                            className="flex items-center gap-[4px] px-[8px] py-[4px] text-white hover:text-white/80 transition-colors w-fit"
                          >
                            <span className="text-[16px] font-medium font-['Inter_Tight',sans-serif]">Create New Category</span>
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      // Top 6 Pills 3x2 Grid
                      <div className="grid grid-cols-3 gap-[12px]">
                        {visibleCategories.map(c => {
                          const isSelected = autopilotData.category === c.label;
                          return (
                            <div
                              key={c.id}
                              onClick={() => setAutopilotData({ ...autopilotData, category: c.label })}
                              className={`bg-[#191b1f] border p-[8px] rounded-[12px] flex items-center gap-[8px] cursor-pointer ${isSelected ? 'border-[#40c4aa] bg-[rgba(64,196,170,0.1)]' : 'border-[#2e2f33] hover:bg-[#2e2f33]/40'} transition-all`}
                            >
                              <div className={`w-[24px] h-[24px] rounded-[6px] flex items-center justify-center ${isSelected ? 'bg-[#40c4aa]/20' : ''}`}>
                                <CategoryIcon icon={c.icon} size={18} color={isSelected ? '#40c4aa' : '#99a0ae'} />
                              </div>
                              <span className={`font-['Inter_Tight',sans-serif] text-[14px] truncate ${isSelected ? 'text-white' : 'text-[#99a0ae]'}`}>
                                {c.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* See All Categories Toggle */}
                  {!showAllCategories && searchQuery === '' && (
                    <button
                      onClick={() => {
                        setShowAllCategories(true);
                        setTimeout(() => {
                          const catSection = document.getElementById('category-section-container');
                          catSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="flex items-center justify-center gap-[4px] mt-[4px] text-[#717784] hover:text-white transition-colors w-100 py-[4px]"
                    >
                      <span className="text-[16px] font-medium font-['Inter_Tight',sans-serif]">See All Categories</span>
                      <ChevronRight size={16} />
                    </button>
                  )}

                  {showAllCategories && (
                    <button
                      onClick={() => { setShowAllCategories(false); setSearchQuery(''); }}
                      className="absolute top-[12px] right-[12px] p-[8px] hover:bg-[#2e2f33]/40 rounded-full transition-colors z-10"
                    >
                      <X size={16} className="text-[#99a0ae] hover:text-white" />
                    </button>
                  )}
                </>
              ) : (
                // Create Category View
                <div className="animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-[8px] mb-[16px]">
                    <button
                      onClick={() => setCategoryViewState('list')}
                      className="p-[4px] hover:bg-[#2e2f33] rounded-full transition-colors text-[#99a0ae] hover:text-white"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <span className="text-white font-medium font-['Inter_Tight',sans-serif] text-[16px]">Where does it belong?</span>
                  </div>

                  <div className="flex flex-col gap-[12px] max-h-[300px] overflow-y-auto scrollbar-hide py-[4px]">
                    {masterCategoryOptions.map((masterCat, idx) => (
                      <div
                        key={masterCat}
                        onClick={() => handleCreateCategory(masterCat)}
                        className={`flex items-center justify-between px-[12px] py-[8px] cursor-pointer hover:bg-[#2e2f33]/50 rounded-[8px] transition-colors`}
                      >
                        <span className="text-white text-[14px] font-['Inter_Tight',sans-serif]">{masterCat}</span>
                        <div className="w-[16px] h-[16px] rounded-full border border-[#717784]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="flex flex-col gap-[8px] shrink-0 z-50">
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
                  className={`bg-[#131417] border border-[#2e2f33] p-[12px] ${isScheduleOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
                >
                  <span className="text-[16px] text-white font-['Inter_Tight',sans-serif]">
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
            <div className="flex flex-col gap-[8px] shrink-0 mb-[16px]">
              <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px] text-[#717784]">Note</p>
              <div className="bg-[#131417] border border-[#2e2f33] p-[12px] rounded-[8px] flex items-center focus-within:border-[#99a0ae] transition-colors">
                <input
                  type="text"
                  value={autopilotData.note}
                  onChange={(e) => setAutopilotData({ ...autopilotData, note: e.target.value })}
                  placeholder="Add a note"
                  className="bg-transparent border-none outline-none font-['Inter_Tight',sans-serif] text-[16px] text-white flex-1"
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
