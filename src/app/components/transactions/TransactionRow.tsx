import { CategoryIcon } from './CategoryIcon';
import { MoreVertical } from 'lucide-react';

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  subcategory: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
}

interface TransactionRowProps {
  transaction: Transaction;
  onMenuClick?: (transactionId: string) => void;
}

function TransactionIcon({ icon }: { icon: string }) {
  return (
    <div
      className="relative rounded-[10px] shrink-0 size-[40px] flex items-center justify-center bg-white/[0.03] border border-white/[0.03]"
    >
      <CategoryIcon icon={icon} size={20} color="#99A0AE" />
    </div>
  );
}

export function TransactionRow({ transaction, onMenuClick }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  const formattedAmount = `${isIncome ? '+' : '-'}LKR ${transaction.amount.toLocaleString()}`;
  // Expense uses design-system destructive, income uses chart-1 green
  const amountColor = isIncome ? '#40c4aa' : 'var(--destructive)';

  return (
    /* Card row — bg + border overlay + rounded-[10px] matching Figma TransactionRow */
    <div className="bg-[#191b1f] relative rounded-[10px] shrink-0 w-full">
      {/* Absolute border overlay so it sits on top */}
      <div
        aria-hidden="true"
        className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]"
      />

      <div className="flex flex-row items-center size-full">
        <div className="flex gap-[12px] items-center px-[17px] py-[13px] relative w-full">

          {/* Icon */}
          <TransactionIcon icon={transaction.icon} />

          {/* Merchant + category */}
          <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
            <p
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: '14px',
                lineHeight: '18px',
                fontWeight: 500,
                color: 'white',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {transaction.merchant}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-family)',
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 400,
                color: '#94a3b8',
                whiteSpace: 'nowrap',
              }}
            >
              {transaction.category} • {transaction.subcategory}
            </p>
          </div>

          {/* Amount */}
          <p
            style={{
              fontFamily: 'var(--font-family)',
              fontSize: '14px',
              lineHeight: '18px',
              fontWeight: 600,
              color: amountColor,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {formattedAmount}
          </p>

          {/* 3-dot menu button — 30×30 container with icon at left-6 top-6 */}
          <button
            onClick={() => onMenuClick?.(transaction.id)}
            className="relative rounded-[8px] shrink-0 size-[30px] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <MoreVertical
              size={18}
              strokeWidth={1.5}
              color="#717784"
              style={{ position: 'absolute', left: '6px', top: '6px' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
