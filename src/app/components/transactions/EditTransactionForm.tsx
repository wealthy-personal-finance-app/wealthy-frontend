import React, {useState, useRef, useEffect} from "react"
import {
  ChevronDown,
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Calendar as CalendarIcon,
} from "lucide-react"
import {AutopilotIcon} from "./AutopilotRow"
import {CategoryIcon} from "./CategoryIcon"
import {toast} from "sonner"
import {CategoryData} from "./AddTransactionModal"
import {getAuthToken} from "../../utils/auth"
import {apiFetchJson} from "../../apis/client"
import {ENDPOINTS} from "../../apis/endpoints"

function getIconForCategoryLabel(label: string): string {
  const lower = label.toLowerCase()
  if (
    lower.includes("hous") ||
    lower.includes("rent") ||
    lower.includes("mortgage")
  )
    return "house"
  if (lower.includes("food") || lower.includes("din")) return "coffee"
  if (
    lower.includes("transport") ||
    lower.includes("car") ||
    lower.includes("gas")
  )
    return "bus"
  if (lower.includes("util")) return "zap"
  if (
    lower.includes("debt") ||
    lower.includes("card") ||
    lower.includes("loan")
  )
    return "credit-card"
  if (lower.includes("insur")) return "shield"
  if (lower.includes("tax")) return "taxes"
  if (lower.includes("entertain") || lower.includes("movie")) return "film"
  if (lower.includes("shop")) return "shopping-cart"
  if (lower.includes("travel") || lower.includes("vacation")) return "plane"
  if (lower.includes("health") || lower.includes("care")) return "heart"
  if (lower.includes("edu")) return "book"
  if (lower.includes("charity") || lower.includes("gift")) return "gift"
  if (lower.includes("salary") || lower.includes("wage")) return "wallet"
  if (
    lower.includes("bank") ||
    lower.includes("save") ||
    lower.includes("cash")
  )
    return "landmark"
  if (
    lower.includes("stock") ||
    lower.includes("invest") ||
    lower.includes("crypto")
  )
    return "trending-up"
  return "star"
}

const fallbackMasterCategories = [
  "Essential Living",
  "Obligations & Liabilities",
  "Discretionary & Lifestyle",
  "Growth & Giving",
  "Unplanned",
  "Earned Income",
  "Passive Income",
  "Portfolio Income",
  "Other Income",
  "Liquid Assets",
  "Investments",
  "Real Estate",
  "Personal Property",
  "Short-Term Liabilities",
  "Long-Term Liabilities",
]

interface EditTransactionFormProps {
  transaction: {
    id: string
    merchant: string
    amount: number
    type: string
    category: string
    subcategory: string
    icon: string
    date: string
  }
  onClose: () => void
  onSave?: (data: any) => void
  onDelete?: (id: string) => void
}

export function EditTransactionForm({
  transaction,
  onClose,
  onSave,
  onDelete,
}: EditTransactionFormProps) {
  const [formData, setFormData] = useState({
    name: transaction.merchant,
    amount: transaction.amount.toString(),
    type: (transaction.type.charAt(0).toUpperCase() +
      transaction.type.slice(1)) as
      | "Expense"
      | "Income"
      | "Asset"
      | "Liability",
    category: transaction.subcategory || "General",
    icon: transaction.icon,
    date: transaction.date
      ? transaction.date.split("T")[0]
      : new Date().toISOString().split("T")[0],
  })

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryViewState, setCategoryViewState] = useState<"list" | "create">(
    "list"
  )
  const [newCategoryLabel, setNewCategoryLabel] = useState("")
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<
    string | null
  >(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  // Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Safely parse initial date
  const [y, m, d] = formData.date.split("-")
  const [viewDate, setViewDate] = useState(
    new Date(Number(y), Number(m) - 1, 1)
  )

  const calendarRef = useRef<HTMLDivElement>(null)

  const [allExpenseCats, setAllExpenseCats] = useState<CategoryData[]>([])
  const [allIncomeCats, setAllIncomeCats] = useState<CategoryData[]>([])
  const [allAssetCats, setAllAssetCats] = useState<CategoryData[]>([])
  const [allLiabilityCats, setAllLiabilityCats] = useState<CategoryData[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false)
      }
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken()
        const {response: res, data: result} = await apiFetchJson<any>(
          ENDPOINTS.transactions.categories,
          {
            method: "GET",
            auth: true,
          }
        )

        if (res.ok) {
          const nestedData = result.data || {}

          const flattenCategories = (typeKey: string): CategoryData[] => {
            const flatList: CategoryData[] = []
            const typeGroup = nestedData[typeKey]
            if (typeGroup) {
              Object.keys(typeGroup).forEach((masterCat) => {
                const subCats = typeGroup[masterCat]
                if (Array.isArray(subCats)) {
                  subCats.forEach((subCatLabel: string) => {
                    flatList.push({
                      id: subCatLabel.toLowerCase().replace(/\s+/g, "-"),
                      label: subCatLabel,
                      icon: getIconForCategoryLabel(subCatLabel),
                      masterCategory: masterCat,
                      transactionType: typeKey,
                    })
                  })
                }
              })
            }
            return flatList
          }

          setAllExpenseCats(flattenCategories("expense"))
          setAllIncomeCats(flattenCategories("income"))
          setAllAssetCats(flattenCategories("asset"))
          setAllLiabilityCats(flattenCategories("liability"))
        }
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const types = ["Expense", "Income", "Asset", "Liability"]

  const currentCategories =
    formData.type === "Expense"
      ? allExpenseCats
      : formData.type === "Income"
      ? allIncomeCats
      : formData.type === "Asset"
      ? allAssetCats
      : allLiabilityCats

  const filteredCategories = currentCategories.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedCategories = filteredCategories.reduce((acc, cat) => {
    if (!acc[cat.masterCategory]) acc[cat.masterCategory] = []
    acc[cat.masterCategory].push(cat)
    return acc
  }, {} as Record<string, CategoryData[]>)

  const dynamicMasterCategories = Array.from(
    new Set(currentCategories.map((c) => c.masterCategory))
  )
  const activeMasterCategoryOptions =
    dynamicMasterCategories.length > 0
      ? dynamicMasterCategories
      : fallbackMasterCategories

  const handleCreateCategory = async (masterCat: string) => {
    const label = newCategoryLabel || searchQuery
    if (!label) return

    const payload = {
      transactionType: formData.type.toLowerCase(),
      label: label,
      icon: getIconForCategoryLabel(label),
      masterCategory: masterCat,
    }

    try {
      const token = getAuthToken()
      const {response: res} = await apiFetchJson(
        ENDPOINTS.transactions.categories,
        {
          method: "POST",
          auth: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      if (res.ok) {
        const newCat: CategoryData = {
          id: label.toLowerCase().replace(/\s+/g, "-"),
          label: label,
          icon: payload.icon,
          masterCategory: masterCat,
          transactionType: payload.transactionType,
        }

        if (formData.type === "Expense")
          setAllExpenseCats([...allExpenseCats, newCat])
        else if (formData.type === "Income")
          setAllIncomeCats([...allIncomeCats, newCat])
        else if (formData.type === "Asset")
          setAllAssetCats([...allAssetCats, newCat])
        else setAllLiabilityCats([...allLiabilityCats, newCat])

        setFormData({...formData, category: newCat.label, icon: newCat.icon})
        setIsCategoryOpen(false)
        setCategoryViewState("list")
        setSearchQuery("")
        toast.success(`Category "${label}" created successfully`)
      } else {
        toast.error("Failed to save category to database.")
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const handleSave = () => {
    const selectedCat = currentCategories.find(
      (c) => c.label === formData.category || c.id === formData.category
    )

    const mappedData = {
      ...formData,
      parentCategory: selectedCat?.masterCategory || transaction.category,
      subCategory: formData.category,
    }

    onSave?.(mappedData)
    toast.success("Changes saved successfully")
    onClose()
  }

  // --- TIMEZONE-SAFE CALENDAR HELPERS ---
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay()

  const handleDateSelect = (day: number) => {
    // Build YYYY-MM-DD manually to prevent JavaScript from shifting timezones!
    const selectedYear = viewDate.getFullYear()
    const selectedMonth = String(viewDate.getMonth() + 1).padStart(2, "0")
    const selectedDay = String(day).padStart(2, "0")

    setFormData({
      ...formData,
      date: `${selectedYear}-${selectedMonth}-${selectedDay}`,
    })
    setIsCalendarOpen(false)
  }

  const changeMonth = (offset: number) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1)
    )
  }

  const formatDateDisplay = (dateStr: string) => {
    try {
      if (!dateStr) return ""
      // Parse safely to avoid timezone shifting
      const [year, month, day] = dateStr.split("-")
      const d = new Date(Number(year), Number(month) - 1, Number(day))
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const days = Array.from(
    {length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth())},
    (_, i) => i + 1
  )
  const firstDay = getFirstDayOfMonth(
    viewDate.getFullYear(),
    viewDate.getMonth()
  )
  const monthName = viewDate.toLocaleString("default", {month: "long"})
  const viewYear = viewDate.getFullYear()

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
                    {formData.name || "New Transaction"}
                  </p>
                  <ChevronDown size={14} color="#99a0ae" />
                </div>
                <p className="font-['Inter_Tight',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap">
                  Transaction overview
                </p>
              </div>
              <p className="font-['Inter_Tight',sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[14px] text-[#df1c41] whitespace-nowrap">
                LKR {Number(formData.amount || 0).toLocaleString()}
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
                    onChange={(e) =>
                      setFormData({...formData, name: e.target.value})
                    }
                    className="bg-transparent flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] min-h-px min-w-px not-italic relative text-[14px] text-[#99a0ae] outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[8px] items-start justify-center min-h-px relative">
                <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                  Amount
                </p>
                <div className="bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full focus-within:border-[#99a0ae] transition-colors shadow-inner">
                  <span className="text-[#717784] font-['Inter_Tight',sans-serif] text-[14px]">
                    LKR
                  </span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({...formData, amount: e.target.value})
                    }
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
                  {types.map((t) => (
                    <div
                      key={t}
                      onClick={() => {
                        const newCatList =
                          t === "Expense"
                            ? allExpenseCats
                            : t === "Income"
                            ? allIncomeCats
                            : t === "Asset"
                            ? allAssetCats
                            : allLiabilityCats
                        const defaultCat =
                          newCatList.length > 0
                            ? newCatList[0].label
                            : "General"
                        const defaultIcon =
                          newCatList.length > 0 ? newCatList[0].icon : "star"
                        setFormData({
                          ...formData,
                          type: t as any,
                          category: defaultCat,
                          icon: defaultIcon,
                        })
                      }}
                      className={`content-stretch flex flex-[1_0_0] gap-[8px] items-center justify-center min-h-px px-[2px] py-[4px] relative rounded-[8px] cursor-pointer transition-all ${
                        formData.type === t
                          ? "bg-[rgba(65,63,63,0.5)] shadow-[0px_1px_6px_0px_rgba(14,18,27,0.08)]"
                          : "bg-transparent hover:bg-[#2e2f33]/30"
                      }`}
                    >
                      <p
                        className={`font-['Inter_Tight',sans-serif] ${
                          formData.type === t
                            ? "font-medium text-white"
                            : "font-normal text-[#717784]"
                        } leading-[24px] not-italic relative shrink-0 text-[10px] text-center whitespace-nowrap`}
                      >
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
                    className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${
                      isCategoryOpen
                        ? "rounded-t-[8px] rounded-b-none"
                        : "rounded-[8px]"
                    } shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer shadow-inner`}
                  >
                    <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784] truncate">
                      {formData.category}
                    </span>
                    <div className="overflow-clip relative shrink-0 size-[20px] pointer-events-none">
                      <ChevronDown
                        color="#717784"
                        size={16}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${
                          isCategoryOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-[#15171a] border border-[#2e2f33] border-solid border-t-0 flex flex-col items-start overflow-clip pb-[24px] pt-[16px] px-[16px] rounded-b-[16px] rounded-t-none shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in slide-in-from-top-1 duration-200">
                      {categoryViewState === "list" ? (
                        <>
                          <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] h-[40px] px-[8px] flex items-center gap-[4px] w-full mb-[8px] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)]">
                            <Search
                              size={16}
                              className="text-[#99a0ae] shrink-0"
                            />
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
                            {isLoadingCategories ? (
                              <div className="py-4 text-center text-[#717784] text-[13px]">
                                Loading categories from database...
                              </div>
                            ) : filteredCategories.length > 0 ? (
                              <>
                                {Object.entries(groupedCategories).map(
                                  ([masterCat, cats]) => (
                                    <div
                                      key={masterCat}
                                      className="flex flex-col items-start w-full gap-[6px] mb-[12px]"
                                    >
                                      <div className="py-[6px] w-full">
                                        <span className="text-[#717784] font-['Inter_Tight',sans-serif] font-medium text-[14px] leading-[18px]">
                                          {masterCat}
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-[6px] items-start w-full">
                                        {cats.map((c, index) => (
                                          <React.Fragment key={c.id}>
                                            {index !== 0 && (
                                              <div className="h-px bg-[#2e2f33] w-full" />
                                            )}
                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setFormData({
                                                  ...formData,
                                                  category: c.label,
                                                  icon: c.icon,
                                                })
                                                setIsCategoryOpen(false)
                                                setSearchQuery("")
                                              }}
                                              className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[12px] cursor-pointer hover:bg-white/[0.04] transition-colors w-full"
                                            >
                                              <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                                                <CategoryIcon
                                                  icon={c.icon}
                                                  size={20}
                                                  color="#99a0ae"
                                                />
                                              </div>
                                              <span className="text-[14px] text-[#99a0ae] font-['Inter_Tight',sans-serif] font-normal leading-[18px]">
                                                {c.label}
                                              </span>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                )}
                                {searchQuery === "" && (
                                  <div className="flex justify-start px-[8px] py-[4px] mt-[8px]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setNewCategoryLabel("")
                                        setCategoryViewState("create")
                                      }}
                                      className="flex items-center justify-center gap-[4px] cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                      <span className="font-['Inter_Tight',sans-serif] font-medium text-[16px] leading-[24px] text-white whitespace-nowrap">
                                        Create New Category
                                      </span>
                                      <ChevronRight
                                        size={20}
                                        className="text-white"
                                      />
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNewCategoryLabel(searchQuery)
                                  setCategoryViewState("create")
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
                          <div className="flex flex-col gap-[8px]">
                            <label className="text-[#717784] text-[10px] font-bold font-['Inter_Tight',sans-serif] uppercase tracking-wider">
                              Name of Category
                            </label>
                            <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] h-[40px] px-[12px] flex items-center shadow-inner focus-within:border-[#99a0ae] transition-colors">
                              <input
                                type="text"
                                value={newCategoryLabel}
                                onChange={(e) =>
                                  setNewCategoryLabel(e.target.value)
                                }
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Category Name"
                                className="bg-transparent flex-1 text-white font-['Inter_Tight',sans-serif] text-[14px] outline-none placeholder:text-[#2e2f33]"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-[8px]">
                            <label className="text-[#717784] text-[10px] font-bold font-['Inter_Tight',sans-serif] uppercase tracking-wider">
                              Choose Main Category
                            </label>
                            <div className="flex flex-col gap-[2px] max-h-[160px] overflow-y-auto scrollbar-hide border border-[#2e2f33] rounded-[8px] bg-[#131417] p-[4px] shadow-inner">
                              {activeMasterCategoryOptions.map((masterOpt) => (
                                <button
                                  key={masterOpt}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedMasterCategory(masterOpt)
                                  }}
                                  className={`flex items-center justify-between px-[12px] py-[8px] rounded-[6px] transition-all font-['Inter_Tight',sans-serif] text-[13px] text-left cursor-pointer ${
                                    selectedMasterCategory === masterOpt
                                      ? "bg-[#2e2f33] text-white font-medium shadow-sm"
                                      : "text-[#99a0ae] hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <span>{masterOpt}</span>
                                  {selectedMasterCategory === masterOpt && (
                                    <Check
                                      size={14}
                                      className="text-[#40c4aa] shrink-0"
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-[8px] pt-[8px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setCategoryViewState("list")
                                setSelectedMasterCategory(null)
                              }}
                              className="flex-1 py-[8px] rounded-[8px] border border-[#2e2f33] text-[#717784] text-[13px] font-medium font-['Inter_Tight',sans-serif] hover:bg-[#2e2f33]/40 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={
                                !newCategoryLabel.trim() ||
                                !selectedMasterCategory
                              }
                              onClick={(e) => {
                                e.stopPropagation()
                                if (selectedMasterCategory)
                                  handleCreateCategory(selectedMasterCategory)
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

            {/* Row 3: Date Picker */}
            <div className="flex flex-col gap-[8px] items-start justify-center min-h-px relative w-full">
              <p className="font-['Inter_Tight',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[14px] text-[#717784] whitespace-nowrap">
                Date
              </p>
              <div className="relative w-full" ref={calendarRef}>
                <div
                  className={`bg-[#141414] border-[1px] border-[#2e2f33] border-solid content-stretch flex gap-[12px] items-center overflow-clip px-[12px] py-[8px] relative ${
                    isCalendarOpen
                      ? "rounded-t-[8px] rounded-b-none"
                      : "rounded-[8px]"
                  } shrink-0 w-full focus-within:border-[#99a0ae] transition-colors cursor-pointer shadow-inner`}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <span className="flex-[1_0_0] font-['Inter_Tight',sans-serif] font-normal leading-[18px] text-[14px] text-[#717784] truncate">
                    {formatDateDisplay(formData.date)}
                  </span>
                  <div className="overflow-clip relative shrink-0 size-[20px] pointer-events-none">
                    <CalendarIcon
                      color="#717784"
                      size={16}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform`}
                    />
                  </div>
                </div>

                {isCalendarOpen && (
                  <div className="absolute top-[100%] left-0 right-0 z-[60] bg-[#15161a] border border-[#2e2f33] border-t-0 rounded-b-[16px] p-[16px] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-[12px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          changeMonth(-1)
                        }}
                        className="p-[4px] hover:bg-[#2e2f33] rounded-full text-[#99a0ae]"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-white text-[14px] font-medium">
                        {monthName} {viewYear}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          changeMonth(1)
                        }}
                        className="p-[4px] hover:bg-[#2e2f33] rounded-full text-[#99a0ae]"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-[2px] mb-[4px]">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div
                          key={d}
                          className="text-[#717784] text-[10px] text-center font-medium"
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-[2px]">
                      {Array.from({length: firstDay}).map((_, i) => (
                        <div key={i} />
                      ))}
                      {days.map((d) => {
                        // Compare cleanly via YYYY-MM-DD
                        const compareY = viewDate.getFullYear()
                        const compareM = String(
                          viewDate.getMonth() + 1
                        ).padStart(2, "0")
                        const compareD = String(d).padStart(2, "0")
                        const dateToCompare = `${compareY}-${compareM}-${compareD}`
                        const isSelected = formData.date === dateToCompare

                        return (
                          <button
                            key={d}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDateSelect(d)
                            }}
                            className={`h-[28px] text-[12px] flex items-center justify-center rounded-[6px] transition-all ${
                              isSelected
                                ? "bg-[#40c4aa] text-black font-semibold"
                                : "text-[#99a0ae] hover:bg-[#2e2f33]"
                            }`}
                          >
                            {d}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
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
  )
}
