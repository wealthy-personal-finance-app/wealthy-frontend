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
          className={`flex-1 h-[36px] flex items-center justify-center rounded-[8px] border transition-all ${
            value.includes(i.toString()) 
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

  const days = Array.from({length: 31}, (_, i) => {
    const d = i + 1;
    const suffix = ['st', 'nd', 'rd'][(d % 10) - 1] || 'th';
    return d > 3 && d < 21 ? `${d}th` : `${d}${suffix}`;
  });
  days.push('Last day of the month');

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
        className={`bg-[#131417] border border-[#2e2f33] ${isOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} p-[12px] flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
      >
        <span className="text-[16px] text-white font-['Inter_Tight',sans-serif]">{value || 'Select day'}</span>
        <ChevronDown size={20} className={`text-[#99a0ae] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 right-0 border border-[#2e2f33] border-t-0 p-[8px] bg-[#15171a] shadow-xl z-50 rounded-b-[8px] animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] p-[4px] max-h-[160px] overflow-y-auto scrollbar-hide">
            {days.map(day => (
              <div 
                key={day}
                onClick={() => { onChange(day); setIsOpen(false); }}
                className={`p-[8px] hover:bg-[#2e2f33]/40 rounded-[6px] cursor-pointer text-[14px] transition-colors ${value === day ? 'bg-[#2e2f33] text-white' : 'text-[#99a0ae] hover:text-white'}`}
              >
                {day}
              </div>
            ))}
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
  const days = Array.from({length: 31}, (_, i) => {
    const d = i + 1;
    const suffix = ['st', 'nd', 'rd'][(d % 10) - 1] || 'th';
    return d > 3 && d < 21 ? `${d}th` : `${d}${suffix}`;
  });
  days.push('Last day of the month');

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
          className={`bg-[#131417] border border-[#2e2f33] ${isMonthOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} p-[12px] flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
        >
          <span className="text-[16px] text-white font-['Inter_Tight',sans-serif]">{value.month || 'Month'}</span>
          <ChevronDown size={20} className={`text-[#99a0ae] transition-transform ${isMonthOpen ? 'rotate-180' : ''}`} />
        </div>
        {isMonthOpen && (
          <div 
            ref={monthMenuRef}
            className="absolute top-full left-0 right-0 border border-[#2e2f33] border-t-0 bg-[#15171a] p-[8px] rounded-b-[8px] shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] p-[4px] max-h-[160px] overflow-y-auto scrollbar-hide">
              {months.map(m => (
                <div 
                  key={m}
                  onClick={() => { onChange({ ...value, month: m }); setIsMonthOpen(false); }}
                  className={`p-[8px] hover:bg-[#2e2f33]/40 rounded-[6px] cursor-pointer text-[14px] transition-colors ${value.month === m ? 'bg-[#2e2f33] text-white' : 'text-[#99a0ae] hover:text-white'}`}
                >
                  {m}
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
          className={`bg-[#131417] border border-[#2e2f33] ${isDayOpen ? 'rounded-t-[8px]' : 'rounded-[8px]'} p-[12px] flex justify-between items-center cursor-pointer hover:border-[#99a0ae] transition-colors`}
        >
          <span className="text-[16px] text-white font-['Inter_Tight',sans-serif]">{value.day || 'Day'}</span>
          <ChevronDown size={20} className={`text-[#99a0ae] transition-transform ${isDayOpen ? 'rotate-180' : ''}`} />
        </div>
        {isDayOpen && (
          <div 
            ref={dayMenuRef}
            className="absolute top-full left-0 right-0 border border-[#2e2f33] border-t-0 p-[8px] bg-[#15171a] rounded-b-[8px] z-50 shadow-xl animate-in fade-in slide-in-from-top-1 duration-200"
          >
             <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[8px] p-[4px] max-h-[160px] overflow-y-auto scrollbar-hide">
              {days.map(d => (
                <div 
                  key={d}
                  onClick={() => { onChange({ ...value, day: d }); setIsDayOpen(false); }}
                  className={`p-[8px] hover:bg-[#2e2f33]/40 rounded-[6px] cursor-pointer text-[14px] transition-colors ${value.day === d ? 'bg-[#2e2f33] text-white' : 'text-[#99a0ae] hover:text-white'}`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
