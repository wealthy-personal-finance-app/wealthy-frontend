import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Plus, ChevronRight } from 'lucide-react';
import { AutopilotFlow, AutopilotIcon } from './AutopilotRow';
import { CategoryIcon } from './CategoryIcon';
import { initialExpenseCategories, initialIncomeCategories, initialAssetCategories, initialLiabilityCategories, CategoryData } from './AddTransactionModal';

function Toggle({ className, active = false }: { className?: string, active?: boolean }) {
  return (
    <div className={className || `content-stretch flex h-[20px] items-center p-[2px] relative rounded-[999px] w-[35px] ${active ? 'bg-[#065f46] justify-end' : 'bg-[#e1e4ea] justify-start'}`}>
      <div className="relative shrink-0 size-[16px] bg-white rounded-full shadow-sm"></div>
    </div>
  );
}

export function EditAutopilotForm({ flow, onClose }: { flow: AutopilotFlow, onClose?: () => void }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const toggleDropdown = (dropdown: 'category' | 'schedule' | 'day' | 'month') => {
    setIsCategoryOpen(dropdown === 'category' ? !isCategoryOpen : false);
    setIsScheduleOpen(dropdown === 'schedule' ? !isScheduleOpen : false);
    setIsDayOpen(dropdown === 'day' ? !isDayOpen : false);
    setIsMonthOpen(dropdown === 'month' ? !isMonthOpen : false);
    if (dropdown === 'category' && !isCategoryOpen) {
      setCategoryViewState('list');
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryViewState, setCategoryViewState] = useState<'list' | 'assign-master'>('list');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCategoryOpen && categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (isScheduleOpen && scheduleRef.current && !scheduleRef.current.contains(event.target as Node)) {
        setIsScheduleOpen(false);
      }
      if (isDayOpen && dayRef.current && !dayRef.current.contains(event.target as Node)) {
        setIsDayOpen(false);
      }
      if (isMonthOpen && monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryOpen, isScheduleOpen, isDayOpen, isMonthOpen]);



  const [formData, setFormData] = useState({
    flowName: flow.title,
    amount: flow.amount.toString(),
    type: flow.type.charAt(0).toUpperCase() + flow.type.slice(1),
    category: 'Housing',
    schedule: 'Daily',
    onDay: '1st day of the month',
    onMonth: 'January',
    selectedDays: ['Sun'],
    note: ''
  });

  const handleSave = () => {
    const payload = { ...formData };
    console.log('Saved changes:', JSON.stringify(payload, null, 2));
  };

  const handleDelete = () => {
    console.log('Delete this Autopilot clicked');
  };

  const types = ['Expense', 'Income', 'Asset', 'Liability'];
  const schedules = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [allExpenseCats, setAllExpenseCats] = useState(initialExpenseCategories);
  const [allIncomeCats, setAllIncomeCats] = useState(initialIncomeCategories);
  const [allAssetCats, setAllAssetCats] = useState(initialAssetCategories);
  const [allLiabilityCats, setAllLiabilityCats] = useState(initialLiabilityCategories);

  const currentCategories = 
    formData.type === 'Expense' ? allExpenseCats :
    formData.type === 'Income' ? allIncomeCats :
    formData.type === 'Asset' ? allAssetCats :
    allLiabilityCats;

  const masterCategoryOptions = Array.from(new Set(currentCategories.map(c => c.masterCategory)));

  const filteredCategories = currentCategories.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const groupedCategories = filteredCategories.reduce((acc, cat) => {
    if (!acc[cat.masterCategory]) acc[cat.masterCategory] = [];
    acc[cat.masterCategory].push(cat);
    return acc;
  }, {} as Record<string, CategoryData[]>);

  const handleCreateCategory = (masterCat: string) => {
    const newCat: CategoryData = {
      id: newCategoryLabel.toLowerCase().replace(/\s+/g, '-'),
      label: newCategoryLabel,
      icon: 'star',
      masterCategory: masterCat
    };

    if (formData.type === 'Expense') setAllExpenseCats([...allExpenseCats, newCat]);
    else if (formData.type === 'Income') setAllIncomeCats([...allIncomeCats, newCat]);
    else if (formData.type === 'Asset') setAllAssetCats([...allAssetCats, newCat]);
    else setAllLiabilityCats([...allLiabilityCats, newCat]);

    setFormData({ ...formData, category: newCategoryLabel });
    setIsCategoryOpen(false);
    setCategoryViewState('list');
    setSearchQuery('');
    
    setFeedback(`Category "${newCategoryLabel}" created in ${masterCat}`);
    setTimeout(() => setFeedback(null), 3000);
  };


  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] border-solid content-stretch flex flex-col gap-[0px] items-start justify-center px-[17px] py-[13px] relative rounded-[10px] w-full">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[32px] items-start relative w-full">
          
          {/* Header Area */}
          <div 
            onClick={onClose}
            className="content-stretch flex flex-col items-start relative shrink-0 w-full cursor-pointer hover:bg-white/[0.02] transition-colors rounded-t-[10px]"
          >
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
              <AutopilotIcon icon={flow.icon} />
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[39px] items-start min-h-px min-w-px relative">
                <div className="content-stretch flex items-center gap-[4px] relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
                    {formData.flowName || 'New Flow'}
                  </p>
                  <ChevronDown size={14} color="#99a0ae" />
                </div>
                <p className="font-['Inter_Tight',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">
                  1st of every month
                </p>
              </div>
              <p className="font-['Inter_Tight',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[14px] text-[#df1c41] whitespace-nowrap">
                -LKR {Number(formData.amount || 0).toLocaleString()}
              </p>
              <Toggle active className="bg-[#065f46] content-stretch flex h-[20px] items-center justify-end p-[2px] relative rounded-[999px] shrink-0 w-[35px]" />
            </div>
          </div>

          <div className="h-0 relative shrink-0 w-full border-t border-[#2e2f33] border-solid" />

          {/* Form Content */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            
            {/* Flow Name & Amount Row */}
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
                <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                    Flow Name
                  </p>
                </div>
                <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full focus-within:border-[#99a0ae] transition-colors">
                  <input 
                    type="text" 
                    value={formData.flowName}
                    onChange={(e) => setFormData({ ...formData, flowName: e.target.value })}
                    placeholder="Enter flow name"
                    className="bg-transparent flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] min-h-px min-w-px not-italic relative text-[14px] text-[#99a0ae] outline-none" 
                  />
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
                <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                    Amount
                  </p>
                </div>
                <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full focus-within:border-[#99a0ae] transition-colors">
                  <span className="text-[#717784] font-['Inter_Tight',sans-serif] text-[14px]">LKR</span>
                  <input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                    className="bg-transparent flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px] outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Type & Category Row */}
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
                <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                    Type
                  </p>
                </div>
                <div className="bg-[#191b1f] border border-[#2e2f33] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[12px] shrink-0 w-full">
                  {types.map(t => (
                    <div 
                      key={t}
                      onClick={() => {
                        const newCatList = t === 'Expense' ? allExpenseCats : t === 'Income' ? allIncomeCats : t === 'Asset' ? allAssetCats : allLiabilityCats;
                        setFormData({ ...formData, type: t, category: newCatList[0].label });
                      }}
                      className={`content-stretch flex flex-[1_0_0] gap-[8px] items-center justify-center min-h-px min-w-px px-[24px] py-[4px] relative rounded-[8px] cursor-pointer transition-all ${
                        formData.type === t 
                          ? 'bg-[rgba(65,63,63,0.5)] shadow-[0px_1px_6px_0px_rgba(14,18,27,0.08)]' 
                          : 'bg-transparent hover:bg-[#2e2f33]/30'
                      }`}
                    >
                      <p className={`font-['Inter_Tight',sans-serif] ${formData.type === t ? 'font-medium text-white' : 'font-normal text-[#717784]'} leading-[24px] not-italic relative shrink-0 text-[16px] text-center whitespace-nowrap`}>
                        {t}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
                <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                    Category
                  </p>
                </div>
                <div className="relative w-full" ref={categoryRef}>
                  <div 
                    onClick={() => toggleDropdown('category')}
                    className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${isCategoryOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer`}
                  >
                    <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784]">
                      {formData.category}
                    </span>
                    <div className="overflow-clip relative shrink-0 size-[20px] pointer-events-none">
                      <ChevronDown color="#717784" size={16} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-[#15171a] border border-[#2e2f33] border-solid border-t-0 flex flex-col items-start overflow-clip pb-[24px] pt-[16px] px-[16px] rounded-b-[16px] rounded-t-none shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in slide-in-from-top-1 duration-200">
                      
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
                                {Object.entries(groupedCategories).map(([masterCat, cats]) => (
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
                                              setFormData({ ...formData, category: c.label });
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
                                     <button className="flex items-center justify-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity">
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
                                  setCategoryViewState('assign-master');
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
                          <p className="font-['Inter_Tight',sans-serif] font-medium text-[16px] text-white">
                            Where does "{newCategoryLabel}" belong?
                          </p>
                          <div className="flex flex-col gap-[8px] max-h-[300px] overflow-y-auto scrollbar-hide">
                            {masterCategoryOptions.map((masterOpt) => (
                              <button
                                key={masterOpt}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCreateCategory(masterOpt);
                                }}
                                className="flex items-center justify-start p-[12px] rounded-[12px] border border-[#2e2f33] bg-[#191b1f] hover:bg-[#2e2f33]/40 transition-all font-['Inter_Tight',sans-serif] text-[14px] text-[#99a0ae] cursor-pointer"
                              >
                                {masterOpt}
                              </button>
                            ))}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryViewState('list');
                            }}
                            className="text-[#717784] text-[12px] hover:text-white transition-colors"
                          >
                            Back to list
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule & Note Row */}
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
                <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                    Schedule
                  </p>
                </div>
                <div className="relative w-full" ref={scheduleRef}>
                  <div 
                    onClick={() => toggleDropdown('schedule')}
                    className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${isScheduleOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer`}
                  >
                    <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784]">
                      {formData.schedule}
                    </span>
                    <div className="overflow-clip relative shrink-0 size-[20px] pointer-events-none">
                      <ChevronDown color="#717784" size={16} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${isScheduleOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isScheduleOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-[#15161a] border border-[#2e2f33] border-solid border-t-0 flex flex-col items-start overflow-clip p-[16px] rounded-b-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        {schedules.map((s, index) => (
                          <React.Fragment key={s}>
                            {index !== 0 && <div className="h-px bg-[#2e2f33] w-full" />}
                            <div 
                              onClick={() => {
                                setFormData({ ...formData, schedule: s });
                                setIsScheduleOpen(false);
                              }}
                              className="flex flex-col items-start p-[8px] rounded-[8px] w-full cursor-pointer hover:bg-[#1a1b1f] transition-colors"
                            >
                              <span className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] text-[14px] text-[#717784]">
                                {s}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
                <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                    Note
                  </p>
                </div>
                <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full focus-within:border-[#99a0ae] transition-colors">
                  <input 
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Add a note"
                    className="bg-transparent flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px] outline-none" 
                  />
                </div>
              </div>
            </div>
            
            {/* Conditional 'On day' Field for Monthly Schedule */}
            {formData.schedule === 'Monthly' && (
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center relative shrink-0 min-h-px min-w-px">
                  <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                    <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                      On day
                    </p>
                  </div>
                  <div className="relative w-full" ref={dayRef}>
                    <div 
                      onClick={() => toggleDropdown('day')}
                      className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${isDayOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer`}
                    >
                      <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784]">
                        {formData.onDay}
                      </span>
                      <div className="overflow-clip relative shrink-0 size-[20px] pointer-events-none">
                        <ChevronDown color="#717784" size={16} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${isDayOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {isDayOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-[#15161a] border border-[#2e2f33] border-solid border-t-0 flex flex-col gap-[16px] items-start overflow-clip p-[16px] rounded-b-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in slide-in-from-top-1 duration-200">
                        <div 
                          onClick={() => {
                            setFormData({ ...formData, onDay: 'Last day of the month' });
                            setIsDayOpen(false);
                          }}
                          className="bg-[#191b1f] border border-[#2e2f33] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[12px] w-full cursor-pointer hover:bg-[#2e2f33]/30 transition-colors"
                        >
                          <span className="font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#99a0ae] whitespace-nowrap">
                            Last day of the month
                          </span>
                        </div>

                        <div className="grid grid-cols-7 gap-[8px] w-full">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <div 
                              key={day}
                              onClick={() => {
                                const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
                                setFormData({ ...formData, onDay: `${day}${suffix} day of the month` });
                                setIsDayOpen(false);
                              }}
                              className="bg-[#191b1f] border border-[#2e2f33] border-solid flex items-center justify-center py-[12px] relative rounded-[12px] cursor-pointer hover:bg-[#2e2f33]/30 transition-colors"
                            >
                              <span className="font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#99a0ae]">
                                {day}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Spacer to keep it half-width, matching the Schedule/Note layout */}
                <div className="flex-[1_0_0]" />
              </div>
            )}

            {/* Conditional 'Select Days' Field for Weekly Schedule */}
            {formData.schedule === 'Weekly' && (
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center relative shrink-0 min-h-px min-w-px">
                  <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                    <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                      Select Days
                    </p>
                  </div>
                  <div className="flex gap-[8px] items-center relative shrink-0">
                    {[
                      { label: 'S', value: 'Sun' },
                      { label: 'M', value: 'Mon' },
                      { label: 'T', value: 'Tue' },
                      { label: 'W', value: 'Wed' },
                      { label: 'T', value: 'Thu' },
                      { label: 'F', value: 'Fri' },
                      { label: 'S', value: 'Sat' }
                    ].map((dayObj, index) => {
                      const isSelected = formData.selectedDays.includes(dayObj.value);
                      return (
                        <div 
                          key={`${dayObj.value}-${index}`}
                          onClick={() => {
                            const newDays = isSelected 
                              ? formData.selectedDays.filter(v => v !== dayObj.value)
                              : [...formData.selectedDays, dayObj.value];
                            setFormData({ ...formData, selectedDays: newDays });
                          }}
                          className={`content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[12px] shrink-0 min-w-[34px] cursor-pointer transition-all border border-solid ${
                            isSelected 
                              ? 'bg-[#065f46] border-[rgba(255,255,255,0.2)]' 
                              : 'bg-[rgba(65,63,63,0.2)] border-[#2e2f33] hover:bg-[#2e2f33]/40'
                          }`}
                        >
                          <span className={`font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] ${isSelected ? 'text-white' : 'text-[#717784]'}`}>
                            {dayObj.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex-[1_0_0]" />
              </div>
            )}

            {/* Conditional 'Month' and 'Date' Fields for Yearly Schedule */}
            {formData.schedule === 'Yearly' && (
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Month Picker */}
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center relative shrink-0 min-h-px min-w-px">
                  <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                    <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                      Month
                    </p>
                  </div>
                  <div className="relative w-full" ref={monthRef}>
                    <div 
                      onClick={() => toggleDropdown('month')}
                      className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${isMonthOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer`}
                    >
                      <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784]">
                        {formData.onMonth}
                      </span>
                      <div className="overflow-clip relative shrink-0 size-[20px] pointer-events-none">
                        <ChevronDown color="#717784" size={16} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${isMonthOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {isMonthOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-[#15161a] border border-[#2e2f33] border-solid border-t-0 flex flex-col items-start overflow-y-auto max-h-[250px] p-[16px] rounded-b-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] scrollbar-hide animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex flex-col gap-[6px] items-start w-full">
                          {months.map((m, index) => (
                            <React.Fragment key={m}>
                              {index !== 0 && <div className="h-px bg-[#2e2f33] w-full" />}
                              <div 
                                onClick={() => {
                                  setFormData({ ...formData, onMonth: m });
                                  setIsMonthOpen(false);
                                }}
                                className="flex flex-col items-start p-[8px] rounded-[8px] w-full cursor-pointer hover:bg-[#1a1b1f] transition-colors"
                              >
                                <span className={`font-['Inter_Tight',sans-serif] font-medium leading-[18px] text-[14px] ${formData.onMonth === m ? 'text-white' : 'text-[#717784]'}`}>
                                  {m}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Picker (Day) */}
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center relative shrink-0 min-h-px min-w-px">
                  <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                    <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                      Date
                    </p>
                  </div>
                  <div className="relative w-full">
                    <div 
                      onClick={() => toggleDropdown('day')}
                      className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${isDayOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer`}
                    >
                      <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784]">
                        {formData.onDay}
                      </span>
                      <div className="overflow-clip relative shrink-0 size-[20px] pointer-events-none">
                        <ChevronDown color="#717784" size={16} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${isDayOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {isDayOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-[#15161a] border border-[#2e2f33] border-solid border-t-0 flex flex-col gap-[16px] items-start overflow-clip p-[16px] rounded-b-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)]">
                        <div 
                          onClick={() => {
                            setFormData({ ...formData, onDay: 'Last day of the month' });
                            setIsDayOpen(false);
                          }}
                          className="bg-[#191b1f] border border-[#2e2f33] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[12px] w-full cursor-pointer hover:bg-[#2e2f33]/30 transition-colors"
                        >
                          <span className="font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#99a0ae] whitespace-nowrap">
                            Last day of the month
                          </span>
                        </div>

                        <div className="grid grid-cols-7 gap-[8px] w-full">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <div 
                              key={day}
                              onClick={() => {
                                const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
                                setFormData({ ...formData, onDay: `${day}${suffix} day of the month` });
                                setIsDayOpen(false);
                              }}
                              className="bg-[#191b1f] border border-[#2e2f33] border-solid flex items-center justify-center py-[12px] relative rounded-[12px] cursor-pointer hover:bg-[#2e2f33]/30 transition-colors"
                            >
                              <span className="font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#99a0ae]">
                                {day}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions Row */}
            <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-full mt-[8px]">
              <button 
                onClick={handleDelete}
                className="border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#2e2f33]/20 transition-colors cursor-pointer"
              >
                <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0">
                  <span className="font-['Inter_Tight',sans-serif] font-medium leading-[24px] text-[16px] text-[#df1c41] whitespace-nowrap">
                    Delete this Autopilot
                  </span>
                </div>
              </button>
              
              <button 
                onClick={handleSave}
                className="bg-[#065f46] border-[1px] border-[rgba(255,255,255,0.2)] border-solid content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#065f46]/90 transition-colors cursor-pointer"
              >
                <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0">
                  <span className="font-['Inter_Tight',sans-serif] font-medium leading-[24px] text-[16px] text-white whitespace-nowrap">
                    Save Changes
                  </span>
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>
      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-[100] bg-[#065f46] border border-white/20 text-white px-[20px] py-[10px] rounded-[12px] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="font-['Inter_Tight',sans-serif] font-medium text-[14px]">
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
}
