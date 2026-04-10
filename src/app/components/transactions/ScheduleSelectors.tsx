import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export function WeeklySelector({ value, onChange }: { value: string[], onChange: (days: string[]) => void }) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDay = (dayIndex: number) => {
    const dayStr = dayIndex.toString();
    const current = [...value];
    if (current.includes(dayStr)) {
      onChange(current.filter(d => d !== dayStr));
    } else {
      onChange([...current, dayStr]);
    }
  };

  return (
    <div className="flex gap-[8px] items-center w-full">
      {days.map((day, i) => (
        <button
          key={i}
          onClick={() => toggleDay(i)}
          className={`flex-1 h-[36px] flex items-center justify-center rounded-[8px] border transition-all ${value.includes(i.toString())
              ? 'bg-[#065f46] border-[#087f5b] text-white'
              : 'bg-[#131417] border-[#2e2f33] text-[#717784] hover:bg-[#2e2f33]/40'
            }`}
        >
          <span className="font-['Inter_Tight',sans-serif] font-medium text-[14px]">{day}</span>
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[#2e2f33] w-full" />;
}

export function MonthlySelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getDayLabel = (d: number) => {
    const suffix = ['st', 'nd', 'rd'][(d % 10) - 1] || 'th';
    return d > 3 && d < 21 ? `${d}th` : `${d}${suffix}`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => {
          const newOpen = !isOpen;
          setIsOpen(newOpen);
          if (newOpen) {
            setTimeout(() => {
              containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
          }
        }}
        className={`bg-[#131417] border border-[#2e2f33] ${isOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} py-[8px] px-[12px] flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
      >
        <span className="text-[16px] text-white font-['Inter_Tight',sans-serif]">{value || 'Select day'}</span>
        <ChevronDown size={20} className={`text-[#99a0ae] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 right-0 border border-[#2e2f33] border-t-0 bg-[#15171a] shadow-xl z-50 rounded-b-[12px] animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="flex flex-col p-[16px] gap-[12px]">
            {/* Last Day Button */}
            <button
              onClick={() => { onChange('Last day of the month'); setIsOpen(false); }}
              className={`w-full py-[10px] rounded-[12px] border border-[#2e2f33] text-[14px] font-medium font-['Inter_Tight',sans-serif] transition-all ${value === 'Last day of the month' ? 'bg-[#2e2f33] text-white' : 'bg-[#191b1f] text-[#99a0ae] hover:bg-white/[0.04] hover:text-white'
                }`}
            >
              Last day of the month
            </button>

            {/* Grid of Days */}
            <div className="grid grid-cols-7 gap-[8px]">
              {days.map((d) => {
                const label = getDayLabel(d);
                const isSelected = value === label;
                return (
                  <button
                    key={d}
                    onClick={() => { onChange(label); setIsOpen(false); }}
                    className={`h-[40px] flex items-center justify-center rounded-[12px] border border-[#2e2f33] text-[14px] font-medium font-['Inter_Tight',sans-serif] transition-all ${isSelected ? 'bg-[#2e2f33] text-white' : 'bg-[#191b1f] text-[#99a0ae] hover:bg-white/[0.04] hover:text-white'
                      }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function YearlySelector({ value, onChange }: { value: { month?: string, day?: string }, onChange: (val: any) => void }) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const monthContainerRef = useRef<HTMLDivElement>(null);
  const dayContainerRef = useRef<HTMLDivElement>(null);

  const monthMenuRef = useRef<HTMLDivElement>(null);
  const dayMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMonthOpen) {
      setTimeout(() => {
        monthMenuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [isMonthOpen]);

  useEffect(() => {
    if (isDayOpen) {
      setTimeout(() => {
        dayMenuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [isDayOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMonthOpen && monthContainerRef.current && !monthContainerRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (isDayOpen && dayContainerRef.current && !dayContainerRef.current.contains(event.target as Node)) {
        setIsDayOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMonthOpen, isDayOpen]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysList = Array.from({ length: 31 }, (_, i) => i + 1);

  const getDayLabel = (d: number) => {
    const suffix = ['st', 'nd', 'rd'][(d % 10) - 1] || 'th';
    return d > 3 && d < 21 ? `${d}th` : `${d}${suffix}`;
  };

  return (
    <div className="flex gap-[16px] w-full">
      <div className="relative flex-1" ref={monthContainerRef}>
        <div
          onClick={() => {
            const newOpen = !isMonthOpen;
            setIsMonthOpen(newOpen);
            setIsDayOpen(false);
            if (newOpen) {
              setTimeout(() => {
                monthContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 100);
            }
          }}
          className={`bg-[#131417] border border-[#2e2f33] ${isMonthOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} py-[8px] px-[12px] flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
        >
          <span className="text-[16px] text-white font-['Inter_Tight',sans-serif]">{value.month || 'Month'}</span>
          <ChevronDown size={20} className={`text-[#99a0ae] transition-transform ${isMonthOpen ? 'rotate-180' : ''}`} />
        </div>
        {isMonthOpen && (
          <div
            ref={monthMenuRef}
            className="absolute top-full left-0 right-0 border border-[#2e2f33] border-t-0 bg-[#15171a] shadow-xl z-50 rounded-b-[12px] animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex flex-col p-[12px] gap-[4px] max-h-[240px] overflow-y-auto scrollbar-hide">
              {months.map((m, idx) => (
                <div key={m} className="flex flex-col w-full">
                  {idx > 0 && <Divider />}
                  <div
                    onClick={() => { onChange({ ...value, month: m }); setIsMonthOpen(false); }}
                    className={`py-[10px] px-[8px] rounded-[8px] cursor-pointer text-[14px] transition-colors font-['Inter_Tight',sans-serif] font-medium ${value.month === m ? 'bg-[#2e2f33] text-white' : 'text-[#99a0ae] hover:bg-white/[0.04] hover:text-white'}`}
                  >
                    {m}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative flex-1" ref={dayContainerRef}>
        <div
          onClick={() => {
            const newOpen = !isDayOpen;
            setIsDayOpen(newOpen);
            setIsMonthOpen(false);
            if (newOpen) {
              setTimeout(() => {
                dayContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 100);
            }
          }}
          className={`bg-[#131417] border border-[#2e2f33] ${isDayOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} py-[8px] px-[12px] flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
        >
          <span className="text-[16px] text-white font-['Inter_Tight',sans-serif]">{value.day || 'Day'}</span>
          <ChevronDown size={20} className={`text-[#99a0ae] transition-transform ${isDayOpen ? 'rotate-180' : ''}`} />
        </div>
        {isDayOpen && (
          <div
            ref={dayMenuRef}
            className="absolute top-full left-0 right-0 border border-[#2e2f33] border-t-0 bg-[#15171a] shadow-xl z-50 rounded-b-[12px] animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex flex-col p-[16px] gap-[12px]">
              {/* Last Day Button */}
              <button
                onClick={() => { onChange({ ...value, day: 'Last day of the month' }); setIsDayOpen(false); }}
                className={`w-full py-[10px] rounded-[12px] border border-[#2e2f33] text-[14px] font-medium font-['Inter_Tight',sans-serif] transition-all ${value.day === 'Last day of the month' ? 'bg-[#2e2f33] text-white' : 'bg-[#191b1f] text-[#99a0ae] hover:bg-white/[0.04] hover:text-white'
                  }`}
              >
                Last day of the month
              </button>

              {/* Grid of Days */}
              <div className="grid grid-cols-7 gap-[8px]">
                {daysList.map((d) => {
                  const label = getDayLabel(d);
                  const isSelected = value.day === label;
                  return (
                    <button
                      key={d}
                      onClick={() => { onChange({ ...value, day: label }); setIsDayOpen(false); }}
                      className={`h-[32px] flex items-center justify-center rounded-[12px] border border-[#2e2f33] text-[12px] font-medium font-['Inter_Tight',sans-serif] transition-all ${isSelected ? 'bg-[#2e2f33] text-white' : 'bg-[#191b1f] text-[#99a0ae] hover:bg-white/[0.04] hover:text-white'
                        }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
