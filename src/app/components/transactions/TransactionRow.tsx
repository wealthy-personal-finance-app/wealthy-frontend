import React, { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EditTransactionForm } from './EditTransactionForm';

// WE ADDED "date: string;" RIGHT HERE:
export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  subcategory: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
  date: string; 
}

interface TransactionRowProps {
  transaction: Transaction;
  onMenuClick?: (transactionId: string) => void;
  onDelete?: (transactionId: string) => void;
  onUpdate?: (transactionId: string, data: any) => void;
}

function TransactionIcon({ icon }: { icon: string }) {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[40px] flex items-center justify-center bg-white/[0.03] border border-white/[0.03]">
      <CategoryIcon icon={icon} size={20} color="#99A0AE" />
    </div>
  );
}

export function TransactionRow({ transaction, onMenuClick, onDelete, onUpdate }: TransactionRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) return null;

  if (isEditing) {
    return (
      <EditTransactionForm 
        transaction={transaction}
        onClose={() => setIsEditing(false)}
        onSave={(data) => {
          onUpdate?.(transaction.id, data);
          setIsEditing(false);
        }}
        onDelete={() => {
          setIsHidden(true);
          onDelete?.(transaction.id);
        }}
      />
    );
  }

  const isIncome = transaction.type === 'income';
  const formattedAmount = `${isIncome ? '+' : '-'}LKR ${transaction.amount.toLocaleString()}`;
  const amountColor = isIncome ? '#40c4aa' : 'var(--destructive)';

  return (
    <div className="bg-[#191b1f] relative rounded-[10px] shrink-0 w-full group">
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[10px]" />

      <div className="flex flex-row items-center size-full">
        <div className="flex gap-[12px] items-center px-[17px] py-[13px] relative w-full">
          <TransactionIcon icon={transaction.icon} />

          <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
            <p style={{ fontFamily: 'var(--font-family)', fontSize: '14px', lineHeight: '18px', fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {transaction.merchant}
            </p>
            <p style={{ fontFamily: 'var(--font-family)', fontSize: '12px', lineHeight: '16px', fontWeight: 400, color: '#94a3b8', whiteSpace: 'nowrap' }}>
              {transaction.category} • {transaction.subcategory}
            </p>
          </div>

          <p style={{ fontFamily: 'var(--font-family)', fontSize: '14px', lineHeight: '18px', fontWeight: 600, color: amountColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {formattedAmount}
          </p>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="relative rounded-[8px] shrink-0 size-[30px] hover:bg-[rgba(255,255,255,0.06)] transition-colors flex items-center justify-center outline-none">
                <MoreVertical size={18} strokeWidth={1.5} color="#717784" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content side="bottom" align="end" sideOffset={4} className="z-50 w-[140px] bg-[#15161a] border border-[#2e2f33] rounded-[12px] p-[6px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)] animate-in fade-in zoom-in-95 duration-200 outline-none">
                <DropdownMenu.Item onSelect={() => setIsEditing(true)} className="flex items-center gap-[10px] py-[8px] px-[12px] rounded-[8px] cursor-pointer hover:bg-white/[0.04] transition-colors outline-none group">
                  <Edit2 size={14} className="text-[#99a0ae] group-hover:text-white" />
                  <span className="text-[13px] text-[#99a0ae] group-hover:text-white font-medium font-['Inter_Tight',sans-serif]">Edit</span>
                </DropdownMenu.Item>
                
                <div className="h-px bg-[#2e2f33] mx-[4px] my-[4px]" />
                
                <DropdownMenu.Item onSelect={() => { setIsHidden(true); onDelete?.(transaction.id); }} className="flex items-center gap-[10px] py-[8px] px-[12px] rounded-[8px] cursor-pointer hover:bg-[#df1c41]/10 transition-colors outline-none group">
                  <Trash2 size={14} className="text-[#df1c41]" />
                  <span className="text-[13px] text-[#df1c41] font-medium font-['Inter_Tight',sans-serif]">Delete</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
}