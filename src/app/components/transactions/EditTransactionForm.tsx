import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus, ChevronRight, X, Check } from 'lucide-react';
import { AutopilotIcon } from './AutopilotRow';
import { CategoryIcon } from './CategoryIcon';
import { toast } from 'sonner';
import { initialExpenseCategories, initialIncomeCategories, initialAssetCategories, initialLiabilityCategories, CategoryData } from './AddTransactionModal';

interface EditTransactionFormProps {
  transaction: {
    id: string;
    merchant: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    icon: string;
  };
  onClose: () => void;
  onSave?: (data: any) => void;
  onDelete?: (id: string) => void;
}

export function EditTransactionForm({ transaction, onClose, onSave, onDelete }: EditTransactionFormProps) {
  const [formData, setFormData] = useState({
    name: transaction.merchant,
    amount: transaction.amount.toString(),
    type: (transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)) as 'Expense' | 'Income' | 'Asset' | 'Liability',
    category: transaction.category,
    icon: transaction.icon
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryViewState, setCategoryViewState] = useState<'list' | 'create'>('list');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<string | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const types = ['Expense', 'Income', 'Asset', 'Liability'];
  const [allExpenseCats, setAllExpenseCats] = useState(initialExpenseCategories);
  const [allIncomeCats, setAllIncomeCats] = useState(initialIncomeCategories);
  const [allAssetCats, setAllAssetCats] = useState(initialAssetCategories);
  const [allLiabilityCats, setAllLiabilityCats] = useState(initialLiabilityCategories);

  const currentCategories =
    formData.type === 'Expense' ? allExpenseCats :
      formData.type === 'Income' ? allIncomeCats :
        formData.type === 'Asset' ? allAssetCats :
          allLiabilityCats;

  const filteredCategories = currentCategories.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const groupedCategories = filteredCategories.reduce((acc, cat) => {
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

    if (formData.type === 'Expense') setAllExpenseCats([...allExpenseCats, newCat]);
    else if (formData.type === 'Income') setAllIncomeCats([...allIncomeCats, newCat]);
    else if (formData.type === 'Asset') setAllAssetCats([...allAssetCats, newCat]);
    else setAllLiabilityCats([...allLiabilityCats, newCat]);

    setFormData({ ...formData, category: newCategoryLabel, icon: 'star' });
    setIsCategoryOpen(false);
    setCategoryViewState('list');
    setSearchQuery('');
    toast.success(`Category "${newCategoryLabel}" created successfully`);
  };

  const handleSave = () => {
    onSave?.(formData);
    toast.success('Changes saved successfully');
    onClose();
  };

  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] border-solid content-stretch flex flex-col gap-[0px] items-start justify-center px-[17px] py-[13px] relative rounded-[10px] w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative w-full">

          {/* Header Area */}
          <div
            onClick={onClose}
            className="content-stretch flex flex-col items-start relative shrink-0 w-full cursor-pointer hover:bg-white/[0.02] transition-colors rounded-t-[10px]"
          >
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
              <AutopilotIcon icon={formData.icon} />
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[39px] items-start min-h-px min-w-px relative">
                <div className="content-stretch flex items-center gap-[4px] relative shrink-0">
                  <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
                    {formData.name || 'New Transaction'}
                  </p>
                  <ChevronDown size={14} color="#99a0ae" />
                </div>
                <p className="font-['Inter_Tight',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">
                  Transaction overview
                </p>
              </div>
              <p className="font-['Inter_Tight',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[14px] text-[#df1c41] whitespace-nowrap">
                -LKR {Number(formData.amount || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="h-0 relative shrink-0 w-full border-t border-[#2e2f33] border-solid" />

          {/* Form Content */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">

            {/* Row 1: Name and Amount */}
            <div className="grid grid-cols-2 gap-[16px] items-center relative shrink-0 w-full">
              <div className="flex flex-col gap-[8px] items-start justify-center min-h-px relative">
                <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                  Name
                </p>
                <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full focus-within:border-[#99a0ae] transition-colors shadow-inner">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-transparent flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] min-h-px min-w-px not-italic relative text-[14px] text-[#99a0ae] outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[8px] items-start justify-center min-h-px relative">
                <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                  Amount
                </p>
                <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full focus-within:border-[#99a0ae] transition-colors shadow-inner">
                  <span className="text-[#717784] font-['Inter_Tight',sans-serif] text-[14px]">LKR</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-transparent flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] min-h-px min-w-px not-italic relative text-[#717784] text-[14px] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Type and Category */}
            <div className="grid grid-cols-2 gap-[16px] items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-[8px] items-start justify-center min-h-px relative">
                <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                  Type
                </p>
                <div className="bg-[#191b1f] border border-[#2e2f33] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[12px] shrink-0 w-full shadow-inner">
                  {types.map(t => (
                    <div
                      key={t}
                      onClick={() => {
                        const newCatList = t === 'Expense' ? allExpenseCats : t === 'Income' ? allIncomeCats : t === 'Asset' ? allAssetCats : allLiabilityCats;
                        setFormData({ ...formData, type: t as any, category: newCatList[0].label, icon: newCatList[0].icon });
                      }}
                      className={`content-stretch flex flex-[1_0_0] gap-[8px] items-center justify-center min-h-px px-[2px] py-[4px] relative rounded-[8px] cursor-pointer transition-all ${formData.type === t
                        ? 'bg-[rgba(65,63,63,0.5)] shadow-[0px_1px_6px_0px_rgba(14,18,27,0.08)]'
                        : 'bg-transparent hover:bg-[#2e2f33]/30'
                        }`}
                    >
                      <p className={`font-['Inter_Tight',sans-serif] ${formData.type === t ? 'font-medium text-white' : 'font-normal text-[#717784]'} leading-[24px] not-italic relative shrink-0 text-[10px] text-center whitespace-nowrap`}>
                        {t}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-[8px] items-start justify-center min-h-px relative">
                <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                  Category
                </p>
                <div className="relative w-full" ref={categoryRef}>
                  <div
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${isCategoryOpen ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]'} shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer shadow-inner`}
                  >
                    <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784] truncate">
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
                                  <div key={masterCat} className="flex flex-col items-start w-full gap-[6px] mb-[12px]">
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
                                              setFormData({ ...formData, category: c.label, icon: c.icon });
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
            </div>

            {/* Actions Row */}
            <div className="flex gap-[12px] items-center justify-end w-full mt-[8px]">
              <button
                onClick={onClose}
                className="border-[1px] border-[#2e2f33] border-solid flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] shrink-0 hover:bg-[#2e2f33]/20 transition-colors cursor-pointer"
              >
                <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0">
                   <span className="font-['Inter_Tight',sans-serif] font-medium leading-[24px] text-[16px] text-[#717784] hover:text-white whitespace-nowrap transition-colors">
                    Cancel
                  </span>
                </div>
              </button>

              <button
                onClick={handleSave}
                className="bg-[#065f46] border-[1px] border-[rgba(255,255,255,0.2)] border-solid flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#065f46]/90 transition-colors cursor-pointer"
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
    </div>
  );
}
