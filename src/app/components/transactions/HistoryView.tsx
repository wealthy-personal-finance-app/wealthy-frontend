import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk";
import { Transaction, TransactionRow } from './TransactionRow';
import { FilterMenu, FilterState } from './FilterMenu';

export interface TransactionGroup {
  date: string;
  label: string;
  transactions: Transaction[];
}

interface HistoryViewProps {
  transactionGroups: TransactionGroup[];
  selectedCategory?: 'all' | 'income' | 'expenses';
  searchQuery?: string;
  onCategoryChange?: (category: 'all' | 'income' | 'expenses') => void;
  onSearchChange?: (query: string) => void;
  onTransactionMenuClick?: (transactionId: string) => void;
  onFilterChange?: (filters: FilterState) => void;
}

/** Search magnifier — path p31d7be00 from svg-pq2oaob5wk */
function SearchIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[16.25%]">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9999 15">
            <path
              d={svgPaths.p31d7be00}
              stroke="#99A0AE"
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

export function HistoryView({
  transactionGroups,
  selectedCategory = 'all',
  searchQuery = '',
  onCategoryChange,
  onSearchChange,
  onTransactionMenuClick,
  onFilterChange,
}: HistoryViewProps) {
  return (
    <div className="flex flex-col h-full">

      {/* ── Search + Filter Row ─────────────────────────────── */}
      <div className="px-[32px] pt-[0px] pb-[16px]">

        {/* Row: search input + filter button */}
        <div className="flex gap-[12px] items-center w-full">

          {/* Search Input — bg-[#141414] matching Figma Buttons1 */}
          <div className="bg-[#141414] flex-1 h-[40px] min-w-0 relative rounded-[8px]">
            <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
              <div className="flex gap-[4px] items-center p-[8px] relative size-full">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search merchants..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none placeholder:text-[#99a0ae]"
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '18px',
                    color: 'white',
                  }}
                />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)]"
            />
          </div>

          {/* Filter Button with FilterMenu */}
          <FilterMenu onChange={onFilterChange} />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-[8px] items-center mt-[16px]">
          {(['all', 'income', 'expenses'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            const label = cat === 'all' ? 'All' : cat === 'income' ? 'Income' : 'Expenses';
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(cat)}
                className="relative rounded-[16px] shrink-0 cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--primary)' : '#191b1f',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                {/* border for inactive pills */}
                {!isActive && (
                  <div
                    aria-hidden="true"
                    className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[16px]"
                  />
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: '14px',
                    lineHeight: '18px',
                    fontWeight: 400,
                    color: isActive ? 'white' : 'var(--muted-foreground)',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Transaction Groups ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-[32px] pb-[32px]">
        {transactionGroups.length === 0 ? (
          <div className="flex items-center justify-center py-[48px]">
            <p
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: '16px',
                color: 'var(--muted-foreground)',
              }}
            >
              No transactions found
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[24px]">
            {transactionGroups.map((group) => (
              <div
                key={group.date}
                className="flex flex-col gap-[12px] items-start w-full"
              >
                {/* Date heading — left-[8px] offset matching Figma Heading1 */}
                <div className="h-[21px] relative shrink-0 w-full">
                  <p
                    className="absolute left-[8px] top-0 whitespace-nowrap"
                    style={{
                      fontFamily: 'var(--font-family)',
                      fontSize: '14px',
                      lineHeight: '18px',
                      fontWeight: 600,
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {group.label}
                  </p>
                </div>

                {/* Rows — gap-[12px] matching Figma Container5 */}
                <div className="flex flex-col gap-[12px] items-start w-full">
                  {group.transactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onMenuClick={onTransactionMenuClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}