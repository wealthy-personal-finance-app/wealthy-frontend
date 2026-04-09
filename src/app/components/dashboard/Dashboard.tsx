import React, { useState } from 'react';
import { 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Activity,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { CategoryIcon } from '../transactions/CategoryIcon';

// --- MOCK DATA FOR BACKEND INTEGRATION ---
const mockDashboardData = {
  totalBalance: 145000,
  habitScore: 9.2,
  streakDays: 12,
  incomeData: [
    { month: 'Jan', amount: 80000 },
    { month: 'Feb', amount: 95000 },
    { month: 'Mar', amount: 125000 },
    { month: 'Apr', amount: 110000 },
    { month: 'May', amount: 130000 },
    { month: 'Jun', amount: 145000 },
  ],
  expenseData: [
    { month: 'Jan', amount: 40000 },
    { month: 'Feb', amount: 45000 },
    { month: 'Mar', amount: 65000 },
    { month: 'Apr', amount: 55000 },
    { month: 'May', amount: 48000 },
    { month: 'Jun', amount: 50000 },
  ],
  allocationData: [
    { category: 'Housing', percentage: 40, color: '#40c4aa' },
    { category: 'Transport', percentage: 20, color: '#005b55' },
    { category: 'Food', percentage: 15, color: '#f59e0b' },
    { category: 'Entertainment', percentage: 15, color: '#6366f1' },
    { category: 'Other', percentage: 10, color: '#94a3b8' },
  ],
  pendingAutopilotTasks: [
    { id: '1', title: 'Apartment Rent', schedule: '1st of every month', amount: -1250, type: 'expense', icon: 'home' },
    { id: '2', title: 'Internet Bill', schedule: '1st of every month', amount: -1250, type: 'expense', icon: 'receipt' },
    { id: '3', title: 'Monthly Salary', schedule: 'Income • Salary', amount: 125000, type: 'income', icon: 'wallet' },
  ],
  netWorthHistory: [
    { month: 'Apr', value: 100000 },
    { month: 'May', value: 115000 },
    { month: 'Jun', value: 125000 },
    { month: 'Jul', value: 140000 },
    { month: 'Aug', value: 165000 },
    { month: 'Sep', value: 145000 },
  ],
  investmentPortfolio: [
    { name: 'Mutual Funds', value: 450000, icon: 'trending-up' },
    { name: 'Crypto', value: 210000, icon: 'zap' },
    { name: 'Fixed Deposits', value: 300000, icon: 'landmark' },
  ],
  totalInvestments: 960000,
};

// --- SUB-COMPONENTS ---

function DashboardHeader({ data }: { data: typeof mockDashboardData }) {
  const [activeAccount, setActiveAccount] = useState('All Accounts');

  return (
    <div className="flex flex-col gap-[16px] w-full mb-[32px]">
      <h1 className="text-[18px] font-medium text-[#717784] font-['Inter_Tight',sans-serif]">
        Good morning, Alexander.
      </h1>
      
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-[8px]">
          {/* Account Selector */}
          <button className="bg-[rgba(65,63,63,0.5)] border border-[#2e2f33] rounded-[8px] px-[16px] py-[8px] flex items-center gap-[8px] w-fit hover:bg-[#2e2f33] transition-colors">
            <span className="text-[16px] text-[#99a0ae] font-['Inter_Tight',sans-serif]">
              {activeAccount}
            </span>
            <ChevronDown size={16} className="text-[#99a0ae]" />
          </button>
          
          {/* Total Balance */}
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            <span className="text-[32px] text-white font-medium font-['Inter_Tight',sans-serif]">
              LKR
            </span>
            <span className="text-[32px] text-[#40c4aa] font-medium font-['Inter_Tight',sans-serif]">
              {data.totalBalance.toLocaleString()}
            </span>
          </div>
          <span className="text-[12px] text-[#717784] font-medium font-['Inter_Tight',sans-serif]">
            Net Available Balance
          </span>
        </div>

        {/* Habit Score Widget */}
        <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[12px] p-[16px] flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-white/[0.03] border border-white/[0.03] flex items-center justify-center">
            <span className="text-[16px] font-bold text-white font-['Arimo',sans-serif]">
              {data.habitScore}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-white font-['Inter_Tight',sans-serif]">
              Habit Score
            </span>
            <span className="text-[12px] text-[#40c4aa] mt-[2px] font-['Inter_Tight',sans-serif]">
              🔥 {data.streakDays}-Day Streak
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const TIME_FILTERS = ['1W', '1M', '3M', '6M', 'YTD', '1Y', 'All'];

function ChartCard({ title, data, dataKey, color, icon: Icon }: any) {
  const [activeFilter, setActiveFilter] = useState('6M');

  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] flex-1 flex flex-col gap-[24px]">
      <div className="flex items-center gap-[12px]">
        <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
          <Icon size={14} className="text-[#99a0ae]" />
        </div>
        <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">{title}</h2>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2f33" vertical={false} />
            <XAxis dataKey="month" stroke="#717784" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#717784" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `LKR ${val/1000}k`} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#101214', border: '1px solid #2e2f33', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="amount" fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center bg-[#101214] p-[4px] rounded-[8px] border border-[#2e2f33]">
        {TIME_FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-[12px] py-[4px] rounded-[6px] text-[12px] font-medium transition-colors ${
              activeFilter === filter ? 'bg-[#2e2f33] text-white' : 'text-[#717784] hover:text-[#99a0ae]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

function ExpenseAllocationWidget({ data }: { data: typeof mockDashboardData.allocationData }) {
  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] flex-1 flex flex-col gap-[24px]">
      <div className="flex items-center gap-[12px]">
        <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
          <PieChartIcon size={14} className="text-[#99a0ae]" />
        </div>
        <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">Expense Allocation</h2>
      </div>

      <div className="flex items-center gap-[24px] h-[200px]">
        {/* Legend */}
        <div className="flex flex-col gap-[12px] flex-1">
          {data.map(item => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[14px] text-[#99a0ae] font-['Inter_Tight',sans-serif]">{item.category}</span>
              </div>
              <span className="text-[14px] text-white font-medium font-['Inter_Tight',sans-serif]">{item.percentage}%</span>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div className="flex-1 h-full relative flex items-center justify-center">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="percentage"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#101214', border: '1px solid #2e2f33', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[24px] font-medium text-white">100%</span>
            <span className="text-[12px] text-[#717784]">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutopilotTasksWidget({ pendingTasks }: { pendingTasks: typeof mockDashboardData.pendingAutopilotTasks }) {
  const handleSkip = (id: string) => console.log('Skip skipped:', id);
  const handleLog = (id: string) => console.log('Log task:', id);

  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] flex-1 flex flex-col overflow-hidden">
      <div className="p-[24px] pb-[16px] flex items-center gap-[12px] border-b border-[#2e2f33]">
        <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
          <Activity size={14} className="text-[#40c4aa]" />
        </div>
        <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">Pending Autopilot Tasks</h2>
      </div>

      <div className="flex flex-col flex-1 p-[16px] gap-[8px] overflow-y-auto">
        {pendingTasks.map((task, idx) => (
          <div key={task.id} className="bg-[#101214] border border-[#2e2f33] rounded-[12px] p-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[16px]">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-white/[0.03] border border-white/[0.03] flex items-center justify-center shrink-0">
                <CategoryIcon icon={task.icon} size={20} color="#99a0ae" />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[14px] font-medium text-white font-['Inter_Tight',sans-serif]">{task.title}</span>
                <span className="text-[12px] text-[#717784] font-['Inter_Tight',sans-serif]">{task.schedule}</span>
              </div>
            </div>
            <div className="flex items-center gap-[24px]">
              <span className={`text-[14px] font-semibold font-['Inter_Tight',sans-serif] ${task.type === 'income' ? 'text-[#40c4aa]' : 'text-[var(--destructive)]'}`}>
                {task.amount > 0 ? '+' : ''}LKR {Math.abs(task.amount).toLocaleString()}
              </span>
              <div className="flex items-center gap-[8px]">
                <button 
                  onClick={() => handleSkip(task.id)}
                  className="px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium text-[#99a0ae] hover:text-white transition-colors"
                >
                  Skip
                </button>
                <button 
                  onClick={() => handleLog(task.id)}
                  className="px-[12px] py-[6px] bg-[#2e2f33] rounded-[6px] text-[12px] font-medium text-white hover:bg-[#3e3f43] transition-colors"
                >
                  Log
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-[16px] pt-0 flex gap-[12px]">
         <button className="flex-1 py-[10px] text-center rounded-[8px] border border-[#2e2f33] text-[#717784] hover:text-white font-medium text-[14px] transition-colors" onClick={() => console.log('Skip all')}>
           Skip All Today
         </button>
         <button className="flex-1 py-[10px] text-center rounded-[8px] bg-[#065f46] border border-white/10 hover:bg-[#065f46]/90 text-white font-semibold font-['Inter_Tight',sans-serif] text-[14px] transition-colors" onClick={() => console.log('Log all')}>
           Log All Tasks
         </button>
      </div>
    </div>
  );
}

function NetWorthWidget({ data, investments }: { data: typeof mockDashboardData.netWorthHistory, investments: typeof mockDashboardData.investmentPortfolio }) {
  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] w-full flex gap-[32px]">
      <div className="flex-1 flex flex-col gap-[24px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
            <Activity size={14} className="text-[#99a0ae]" />
          </div>
          <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">Net Worth</h2>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#40c4aa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#40c4aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2f33" vertical={false} />
              <XAxis dataKey="month" stroke="#717784" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#717784" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `LKR ${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#101214', border: '1px solid #2e2f33', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="value" stroke="#40c4aa" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-[300px] flex flex-col gap-[24px]">
        <h2 className="text-[16px] font-medium text-[#717784] font-['Inter_Tight',sans-serif]">Investment Portfolio</h2>
        <div className="flex flex-col gap-[16px]">
          {investments.map(inv => (
            <div key={inv.name} className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] bg-white/[0.03] border border-[#2e2f33] rounded-[10px] flex items-center justify-center">
                  <CategoryIcon icon={inv.icon} size={20} color="#99a0ae" />
                </div>
                <span className="text-[14px] text-white font-medium font-['Inter_Tight',sans-serif]">{inv.name}</span>
              </div>
              <span className="text-[14px] text-[#99a0ae] font-medium font-['Inter_Tight',sans-serif]">
                LKR {inv.value.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="w-full h-px bg-[#2e2f33] my-[8px]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] bg-white/[0.03] border border-[#2e2f33] rounded-[10px] flex items-center justify-center">
                <CategoryIcon icon="award" size={20} color="#40c4aa" />
              </div>
              <span className="text-[14px] text-[#40c4aa] font-medium font-['Inter_Tight',sans-serif]">Total Investments</span>
            </div>
            <span className="text-[14px] text-white font-bold font-['Inter_Tight',sans-serif]">
              LKR {mockDashboardData.totalInvestments.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---

export function Dashboard() {
  return (
    <div className="w-full flex justify-center pb-[100px] animate-in fade-in duration-300">
      <div className="w-full max-w-[1280px] px-[32px] pt-[32px] flex flex-col gap-[24px]">
        <DashboardHeader data={mockDashboardData} />
        
        {/* Top Row: Income vs Expenses */}
        <div className="grid grid-cols-2 gap-[24px] w-full">
          <ChartCard 
            title="Income Overview" 
            data={mockDashboardData.incomeData} 
            dataKey="amount" 
            color="#40c4aa" 
            icon={ArrowUpRight} 
          />
          <ChartCard 
            title="Expense Overview" 
            data={mockDashboardData.expenseData} 
            dataKey="amount" 
            color="#df1c41" 
            icon={ArrowDownRight} 
          />
        </div>

        {/* Middle Row: Allocation & Autopilot */}
        <div className="grid grid-cols-2 gap-[24px] w-full">
          <ExpenseAllocationWidget data={mockDashboardData.allocationData} />
          <AutopilotTasksWidget pendingTasks={mockDashboardData.pendingAutopilotTasks} />
        </div>

        {/* Bottom Row: Net Worth */}
        <NetWorthWidget data={mockDashboardData.netWorthHistory} investments={mockDashboardData.investmentPortfolio} />
      </div>
    </div>
  );
}
